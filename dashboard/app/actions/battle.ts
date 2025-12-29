"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getWeightedSkin, getSkinFloat, getSkinPrice, CASE_CONFIGS, CaseType } from "@/lib/csgo";
import { getSkins } from "@/lib/skins";

export async function getBattleRoomsAction(guildId: string) {
    try {
        const rooms = await prisma.battleRoom.findMany({
            where: {
                guildId,
                status: { in: ["waiting", "running"] },
                isPrivate: false
            },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, rooms };
    } catch (error) {
        console.error("[Battle Action] Error fetching rooms:", error);
        return { success: false, error: "Gagal ambil data room." };
    }
}

export async function getBattleRoomAction(roomId: string) {
    try {
        const room = await prisma.battleRoom.findUnique({
            where: { id: roomId }
        });
        return { success: true, room };
    } catch (error) {
        return { success: false, error: "Room gak ketemu." };
    }
}

export async function executeBattleAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu bang!" };

    try {
        const room = await prisma.battleRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ketemu!" };
        if (room.status !== "running") return { success: false, error: "Battle belum dimulai!" };

        const participants = room.participants as any[];
        const caseConfig = CASE_CONFIGS[room.caseType as CaseType];
        if (!caseConfig) return { success: false, error: "Case type gak valid!" };

        const skinsCache = await getSkins();
        const results: { participantId: string; participantName: string; skins: any[]; totalValue: number }[] = [];

        for (const participant of participants) {
            const skins = [];
            let totalValue = 0;

            for (let i = 0; i < room.crateCount; i++) {
                const rawSkin = getWeightedSkin(skinsCache || [], room.caseType as CaseType, 0);
                const { float, wear } = getSkinFloat();
                const marketPrice = getSkinPrice(rawSkin.rarity?.name || "Consumer Grade", float);

                const skin = {
                    ...rawSkin,
                    name: `${rawSkin.weapon?.name} | ${rawSkin.pattern?.name}`,
                    marketPrice,
                    float,
                    wear,
                    instanceId: `${rawSkin.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
                };

                skins.push(skin);
                totalValue += marketPrice;
            }

            results.push({
                participantId: participant.id,
                participantName: participant.name,
                skins,
                totalValue
            });
        }

        const winner = results.reduce((max, r) => r.totalValue > max.totalValue ? r : max);

        const winnerUser = await prisma.user.findUnique({ where: { id: winner.participantId } });
        if (winnerUser) {
            const inv = { ...(winnerUser.inventory as any) || {} };
            if (!Array.isArray(inv.csSkins)) inv.csSkins = [];

            for (const result of results) {
                inv.csSkins.push(...result.skins);
            }

            await prisma.user.update({
                where: { id: winner.participantId },
                data: { inventory: inv }
            });
        }

        await prisma.battleRoom.update({
            where: { id: roomId },
            data: {
                status: "finished",
                results,
                winnerId: winner.participantId
            }
        });

        return { success: true, results, winnerId: winner.participantId };
    } catch (error) {
        console.error("[Battle Execute] Error:", error);
        return { success: false, error: "Gagal eksekusi battle." };
    }
}

export async function createBattleRoomAction(data: {
    guildId: string;
    caseType: string;
    crateCount: number;
    maxPlayers: number;
    isPrivate: boolean;
}) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu bang!" };

    try {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const room = await prisma.battleRoom.create({
            data: {
                roomCode,
                hostId: session.user.id,
                hostName: session.user.name || "Anonymous",
                hostAvatar: session.user.image,
                guildId: data.guildId,
                caseType: data.caseType,
                crateCount: data.crateCount,
                maxPlayers: data.maxPlayers,
                isPrivate: data.isPrivate,
                participants: [{
                    id: session.user.id,
                    name: session.user.name || "Anonymous",
                    avatar: session.user.image,
                    ready: true
                }]
            }
        });

        revalidatePath("/dashboard/[guildId]/battle", "page");
        return { success: true, room };
    } catch (error) {
        console.error("[Battle Create] Error:", error);
        return { success: false, error: "Gagal bikin room." };
    }
}
