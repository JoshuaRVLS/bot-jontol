"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const TYPING_TEXTS = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human being what one wants the computer to do.",
    "The only way to do great work is to love what you do.",
    "Stay hungry, stay foolish.",
    "Logic will get you from A to B. Imagination will take you everywhere.",
    "Complexity is the enemy of execution.",
    "Life is 10% what happens to you and 90% how you react to it.",
    "Design is not just what it looks like and feels like. Design is how it works."
];

// Type-safe helper to access the potentially non-generated typingRoom property
const db: any = prisma;

export async function getTypingRoomsAction(guildId: string) {
    try {
        const rooms = await db.typingRoom.findMany({
            where: {
                guildId,
                status: { in: ["waiting", "running"] },
                isPrivate: false
            },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, rooms };
    } catch (error) {
        return { success: false, error: "Gagal ambil data room." };
    }
}

export async function createTypingRoomAction(data: {
    guildId: string;
    bet: number;
    isPrivate: boolean;
}) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu bang!" };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.wallet < data.bet) return { success: false, error: "Saldo gak cukup!" };

    try {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const room = await db.typingRoom.create({
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
                    ready: true,
                    progress: 0,
                    wpm: 0
                }]
            }
        });

        await prisma.user.update({
            where: { id: session.user.id },
            data: { wallet: { decrement: data.bet } }
        });

        revalidatePath("/dashboard/[guildId]/typing", "page");
        return { success: true, room };
    } catch (error) {
        return { success: false, error: "Gagal bikin room." };
    }
}

export async function joinTypingRoomAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu!" };

    try {
        const room = await db.typingRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ketemu!" };
        if (room.status !== "waiting") return { success: false, error: "Game udah jalan!" };

        const participants = (room.participants as any[]) || [];
        if (participants.length >= 4) return { success: false, error: "Room penuh!" };

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.wallet < room.bet) return { success: false, error: "Saldo gak cukup!" };

        if (participants.some(p => p.id === session.user.id)) return { success: true, room };

        await prisma.user.update({
            where: { id: session.user.id },
            data: { wallet: { decrement: room.bet } }
        });

        participants.push({
            id: session.user.id,
            name: session.user.name || "Anonymous",
            avatar: session.user.image,
            ready: false,
            progress: 0,
            wpm: 0
        });

        const updatedRoom = await db.typingRoom.update({
            where: { id: roomId },
            data: { participants }
        });

        revalidatePath("/dashboard/[guildId]/typing", "page");
        return { success: true, room: updatedRoom };
    } catch (error) {
        return { success: false, error: "Gagal join room." };
    }
}

export async function toggleTypingReadyAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu!" };

    try {
        const room = await db.typingRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ada!" };

        const participants = (room.participants as any[]).map(p => {
            if (p.id === session.user.id) {
                return { ...p, ready: !p.ready };
            }
            return p;
        });

        const updatedRoom = await db.typingRoom.update({
            where: { id: roomId },
            data: { participants }
        });

        return { success: true, room: updatedRoom };
    } catch (error) {
        return { success: false, error: "Gagal update status ready." };
    }
}

export async function startTypingRaceAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu!" };

    try {
        const room = await db.typingRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ada!" };
        if (room.hostId !== session.user.id) return { success: false, error: "Cuma host yang bisa start!" };

        const participants = room.participants as any[];
        if (participants.length < 2) return { success: false, error: "Butuh minimal 2 player!" };
        if (!participants.every(p => p.ready)) return { success: false, error: "Semua player harus ready!" };

        const targetText = TYPING_TEXTS[Math.floor(Math.random() * TYPING_TEXTS.length)];

        const updatedRoom = await db.typingRoom.update({
            where: { id: roomId },
            data: {
                status: "running",
                targetText
            }
        });

        return { success: true, room: updatedRoom };
    } catch (error) {
        return { success: false, error: "Gagal start game." };
    }
}

export async function finishTypingRaceAction(roomId: string, winnerId: string) {
    try {
        const room = await db.typingRoom.findUnique({ where: { id: roomId } });
        if (!room || room.status !== "running") return { success: false, error: "Room gak valid!" };

        const participants = room.participants as any[];
        const totalPool = room.bet * participants.length;
        const commission = totalPool * 0.05; // 5% house edge
        const prize = totalPool - commission;

        await prisma.user.update({
            where: { id: winnerId },
            data: { wallet: { increment: prize } }
        });

        await db.typingRoom.update({
            where: { id: roomId },
            data: {
                status: "finished",
                winnerId
            }
        });

        return { success: true, prize };
    } catch (error) {
        return { success: false, error: "Gagal proses hasil." };
    }
}

export async function leaveTypingRoomAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu!" };

    try {
        const room = await db.typingRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: true };

        const participants = (room.participants as any[]).filter(p => p.id !== session.user.id);

        if (participants.length === 0 || room.status !== "waiting") {
            if (room.status !== "finished") {
                const oldParticipants = room.participants as any[];
                for (const p of oldParticipants) {
                    await prisma.user.update({
                        where: { id: p.id },
                        data: { wallet: { increment: room.bet } }
                    });
                }
            }
            if (room.status !== "finished") {
                await db.typingRoom.delete({ where: { id: roomId } });
            }
            return { success: true, action: "deleted" };
        } else {
            const updatedRoom = await db.typingRoom.update({
                where: { id: roomId },
                data: {
                    participants,
                    hostId: participants[0].id,
                    hostName: participants[0].name,
                    hostAvatar: participants[0].avatar
                }
            });
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
