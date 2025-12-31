"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSuitRoomsAction(guildId: string) {
    try {
        const rooms = await prisma.suitRoom.findMany({
            where: {
                guildId,
                status: { in: ["waiting", "running"] },
                isPrivate: false
            },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, rooms };
    } catch (error) {
        console.error("[Suit Action] Error fetching rooms:", error);
        return { success: false, error: "Gagal ambil data room." };
    }
}

export async function createSuitRoomAction(data: {
    guildId: string;
    bet: number;
    isPrivate: boolean;
}) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu bang!" };

    // Check balance
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.wallet < data.bet) return { success: false, error: "Saldo wallet lu gak cukup bang!" };

    try {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const room = await prisma.suitRoom.create({
            data: {
                roomCode,
                hostId: session.user.id,
                hostName: session.user.name || "Anonymous",
                hostAvatar: session.user.image,
                guildId: data.guildId,
                bet: data.bet,
                isPrivate: data.isPrivate,
                participants: [{
                    id: session.user.id,
                    name: session.user.name || "Anonymous",
                    avatar: session.user.image,
                    ready: true
                }]
            }
        });

        // Deduct bet from host
        await prisma.user.update({
            where: { id: session.user.id },
            data: { wallet: { decrement: data.bet } }
        });

        revalidatePath("/dashboard/[guildId]/suit", "page");
        return { success: true, room };
    } catch (error) {
        console.error("[Suit Create] Error:", error);
        return { success: false, error: "Gagal bikin room." };
    }
}

export async function joinSuitRoomAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu bang!" };

    try {
        const room = await prisma.suitRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ketemu!" };
        if (room.status !== "waiting") return { success: false, error: "Game udah jalan bang!" };

        const participants = (room.participants as any[]) || [];
        if (participants.length >= 2) return { success: false, error: "Room penuh!" };

        // Check balance
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.wallet < room.bet) return { success: false, error: "Saldo gak cukup bang!" };

        if (participants.some(p => p.id === session.user.id)) return { success: true, room };

        // Deduct bet
        await prisma.user.update({
            where: { id: session.user.id },
            data: { wallet: { decrement: room.bet } }
        });

        participants.push({
            id: session.user.id,
            name: session.user.name || "Anonymous",
            avatar: session.user.image,
            ready: false
        });

        const updatedRoom = await prisma.suitRoom.update({
            where: { id: roomId },
            data: { participants }
        });

        revalidatePath("/dashboard/[guildId]/suit", "page");
        return { success: true, room: updatedRoom };
    } catch (error) {
        return { success: false, error: "Gagal join room." };
    }
}

export async function processSuitResultAction(roomId: string, winnerId: string | null) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu bang!" };

    try {
        const room = await prisma.suitRoom.findUnique({ where: { id: roomId } });
        if (!room || room.status !== "revealed") return { success: false, error: "Room gak valid!" };

        if (winnerId) {
            // Payout: Double the bet to winner
            const totalPrize = room.bet * 2;
            await prisma.user.update({
                where: { id: winnerId },
                data: { wallet: { increment: totalPrize } }
            });
        } else {
            // Draw: Refund bet to both players
            const participants = room.participants as any[];
            for (const p of participants) {
                await prisma.user.update({
                    where: { id: p.id },
                    data: { wallet: { increment: room.bet } }
                });
            }
        }

        await prisma.suitRoom.update({
            where: { id: roomId },
            data: { status: "finished", winnerId }
        });

        return { success: true };
    } catch (error) {
        console.error("[Suit Result] Error:", error);
        return { success: false, error: "Gagal proses hasil." };
    }
}

export async function toggleSuitReadyAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu!" };

    try {
        const room = await prisma.suitRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ada!" };

        const participants = (room.participants as any[]).map(p => {
            if (p.id === session.user.id) {
                return { ...p, ready: !p.ready };
            }
            return p;
        });

        let status = room.status;
        if (participants.length === 2 && participants.every(p => p.ready)) {
            status = "running";
        }

        const updatedRoom = await prisma.suitRoom.update({
            where: { id: roomId },
            data: { participants, status }
        });

        return { success: true, room: updatedRoom };
    } catch (error) {
        return { success: false, error: "Gagal update status ready." };
    }
}

export async function makeSuitMoveAction(roomId: string, choice: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu!" };

    try {
        const room = await prisma.suitRoom.findUnique({ where: { id: roomId } });
        if (!room || room.status !== "running") return { success: false, error: "Game belum jalan!" };

        const participants = (room.participants as any[]).map(p => {
            if (p.id === session.user.id) {
                return { ...p, choice };
            }
            return p;
        });

        const bothChosen = participants.every(p => p.choice);
        let status = room.status;
        if (bothChosen) {
            status = "revealed";
        }

        const updatedRoom = await prisma.suitRoom.update({
            where: { id: roomId },
            data: { participants, status }
        });

        // Safe room (hide choices if not revealed)
        const safeRoom = {
            ...updatedRoom,
            participants: (updatedRoom.participants as any[]).map(p => ({
                ...p,
                choice: status === "revealed" || p.id === session.user.id ? p.choice : (p.choice ? "chosen" : null)
            }))
        };

        return { success: true, room: safeRoom, fullRoom: status === "revealed" ? updatedRoom : null };
    } catch (error) {
        return { success: false, error: "Gagal kirim pilihan." };
    }
}

export async function leaveSuitRoomAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu!" };

    try {
        const room = await prisma.suitRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: true };

        const participants = (room.participants as any[]).filter(p => p.id !== session.user.id);

        if (participants.length === 0 || room.status !== "waiting") {
            // Refund if game hasn't finished normally
            if (room.status !== "finished") {
                const oldParticipants = room.participants as any[];
                for (const p of oldParticipants) {
                    await prisma.user.update({
                        where: { id: p.id },
                        data: { wallet: { increment: room.bet } }
                    });
                }
            }
            await prisma.suitRoom.delete({ where: { id: roomId } });
            return { success: true, action: "deleted" };
        } else {
            const updatedRoom = await prisma.suitRoom.update({
                where: { id: roomId },
                data: { participants, hostId: participants[0].id }
            });
            // Refund the leaver
            await prisma.user.update({
                where: { id: session.user.id },
                data: { wallet: { increment: room.bet } }
            });
            return { success: true, action: "updated", room: updatedRoom };
        }
    } catch (error) {
        return { success: false, error: "Gagal leave room." };
    }
}
