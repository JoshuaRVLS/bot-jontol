import "dotenv/config";
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";

console.log("[Server] Loaded env keys:", Object.keys(process.env).filter(k => k.includes("DISCORD") || k.includes("DATABASE")));

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();

interface Participant {
    id: string;
    name: string;
    avatar?: string;
    ready: boolean;
}

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        path: "/api/socket"
    });

    const battleNamespace = io.of("/battle");

    battleNamespace.on("connection", (socket) => {
        console.log(`[Battle] Client connected: ${socket.id}`);

        socket.on("get_rooms", async (guildId: string) => {
            try {
                const rooms = await prisma.battleRoom.findMany({
                    where: {
                        guildId,
                        status: { in: ["waiting", "running"] },
                        isPrivate: false
                    },
                    orderBy: { createdAt: "desc" }
                });
                socket.emit("room_list", rooms);
            } catch (error) {
                console.error("[Battle] Error fetching rooms:", error);
            }
        });

        socket.on("create_room", async (data: {
            hostId: string;
            hostName: string;
            hostAvatar?: string;
            guildId: string;
            caseType: string;
            crateCount: number;
            maxPlayers: number;
            isPrivate: boolean;
        }) => {
            try {
                const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const room = await prisma.battleRoom.create({
                    data: {
                        roomCode,
                        hostId: data.hostId,
                        hostName: data.hostName,
                        hostAvatar: data.hostAvatar,
                        guildId: data.guildId,
                        caseType: data.caseType,
                        crateCount: data.crateCount,
                        maxPlayers: data.maxPlayers,
                        isPrivate: data.isPrivate,
                        participants: [{ id: data.hostId, name: data.hostName, avatar: data.hostAvatar, ready: true }]
                    }
                });

                socket.join(room.id);
                socket.emit("room_created", room);

                if (!data.isPrivate) {
                    battleNamespace.emit("room_list_update", { action: "add", room });
                }
            } catch (error) {
                console.error("[Battle] Error creating room:", error);
                socket.emit("error", { message: "Gagal bikin room bang!" });
            }
        });

        socket.on("join_room", async (data: { roomId: string; userId: string; userName: string; userAvatar?: string }) => {
            try {
                const room = await prisma.battleRoom.findUnique({ where: { id: data.roomId } });
                if (!room) return socket.emit("error", { message: "Room gak ketemu!" });
                if (room.status !== "waiting") return socket.emit("error", { message: "Battle udah mulai!" });

                const participants = (room.participants as unknown) as Participant[];
                if (participants.length >= room.maxPlayers) {
                    return socket.emit("error", { message: "Room udah penuh!" });
                }
                if (participants.some(p => p.id === data.userId)) {
                    // Already a participant (e.g. invited via Discord), just join the socket room
                    socket.join(data.roomId);
                    return battleNamespace.to(data.roomId).emit("room_update", room);
                }

                participants.push({ id: data.userId, name: data.userName, avatar: data.userAvatar, ready: false });

                const updatedRoom = await prisma.battleRoom.update({
                    where: { id: data.roomId },
                    data: { participants: participants as any }
                });

                socket.join(data.roomId);
                battleNamespace.to(data.roomId).emit("room_update", updatedRoom);
                battleNamespace.emit("room_list_update", { action: "update", room: updatedRoom });
            } catch (error) {
                console.error("[Battle] Error joining room:", error);
                socket.emit("error", { message: "Gagal join room!" });
            }
        });

        socket.on("spectate_room", async (data: { roomId: string; userId: string; userName: string }) => {
            try {
                const room = await prisma.battleRoom.findUnique({ where: { id: data.roomId } });
                if (!room) return socket.emit("error", { message: "Room gak ketemu!" });

                const spectators = (room.spectators as any[]) || [];
                if (!spectators.some(s => s.id === data.userId)) {
                    spectators.push({ id: data.userId, name: data.userName });
                    await prisma.battleRoom.update({
                        where: { id: data.roomId },
                        data: { spectators: spectators as any }
                    });
                }

                socket.join(data.roomId);
                socket.emit("room_joined", room);
            } catch (error) {
                console.error("[Battle] Error spectating:", error);
            }
        });

        socket.on("toggle_ready", async (data: { roomId: string; userId: string }) => {
            try {
                const room = await prisma.battleRoom.findUnique({ where: { id: data.roomId } });
                if (!room) return;

                const participants = (room.participants as unknown) as Participant[];
                const idx = participants.findIndex(p => p.id === data.userId);
                if (idx !== -1) {
                    participants[idx].ready = !participants[idx].ready;
                    const updatedRoom = await prisma.battleRoom.update({
                        where: { id: data.roomId },
                        data: { participants: participants as any }
                    });
                    battleNamespace.to(data.roomId).emit("room_update", updatedRoom);
                }
            } catch (error) {
                console.error("[Battle] Error toggling ready:", error);
            }
        });

        socket.on("start_battle", async (data: { roomId: string; hostId: string }) => {
            try {
                const room = await prisma.battleRoom.findUnique({ where: { id: data.roomId } });
                if (!room) return socket.emit("error", { message: "Room gak ketemu!" });
                if (room.hostId !== data.hostId) return socket.emit("error", { message: "Lu bukan host!" });

                const participants = (room.participants as unknown) as Participant[];
                if (participants.length < 2) return socket.emit("error", { message: "Minimal 2 orang!" });
                if (!participants.every(p => p.ready)) return socket.emit("error", { message: "Ada yang belum ready!" });

                await prisma.battleRoom.update({
                    where: { id: data.roomId },
                    data: { status: "running" }
                });

                battleNamespace.to(data.roomId).emit("battle_start", { roomId: data.roomId });
                battleNamespace.emit("room_list_update", { action: "remove", roomId: data.roomId });

                // Battle logic will be handled client-side with server action for final result
            } catch (error) {
                console.error("[Battle] Error starting:", error);
            }
        });

        socket.on("battle_result", async (data: { roomId: string; results: any[]; winnerId: string }) => {
            try {
                const updatedRoom = await prisma.battleRoom.update({
                    where: { id: data.roomId },
                    data: {
                        status: "finished",
                        results: data.results,
                        winnerId: data.winnerId
                    }
                });

                battleNamespace.to(data.roomId).emit("battle_finished", updatedRoom);
            } catch (error) {
                console.error("[Battle] Error saving result:", error);
            }
        });

        socket.on("leave_room", async (data: { roomId: string; userId: string }) => {
            try {
                const room = await prisma.battleRoom.findUnique({ where: { id: data.roomId } });
                if (!room) return;

                let participants = (room.participants as unknown) as Participant[];
                participants = participants.filter(p => p.id !== data.userId);

                if (participants.length === 0) {
                    await prisma.battleRoom.delete({ where: { id: data.roomId } });
                    battleNamespace.emit("room_list_update", { action: "remove", roomId: data.roomId });
                } else {
                    const newHostId = room.hostId === data.userId ? participants[0].id : room.hostId;
                    const updatedRoom = await prisma.battleRoom.update({
                        where: { id: data.roomId },
                        data: { participants: participants as any, hostId: newHostId }
                    });
                    battleNamespace.to(data.roomId).emit("room_update", updatedRoom);
                    battleNamespace.emit("room_list_update", { action: "update", room: updatedRoom });
                }

                socket.leave(data.roomId);
            } catch (error) {
                console.error("[Battle] Error leaving room:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`[Battle] Client disconnected: ${socket.id}`);
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
