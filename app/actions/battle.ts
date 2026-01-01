"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getWeightedSkin, getSkinFloat, getSkinPrice, CASE_CONFIGS, CaseType } from "@/lib/csgo";
import { getSkins } from "@/lib/skins";
import { addXp } from "@/lib/leveling";

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
    if (!session) return { success: false, error: "Silakan login terlebih dahulu." };

    try {
        const room = await prisma.battleRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ketemu!" };
        if (room.status !== "running") return { success: false, error: "Battle belum dimulai!" };

        const participants = room.participants as any[];
        const isTeam = (room as any).isTeamMode;
        const caseConfig = CASE_CONFIGS[room.caseType as CaseType];
        if (!caseConfig) return { success: false, error: "Case type gak valid!" };

        const skinsCache = await getSkins();
        const results: { participantId: string; participantName: string; skins: any[]; totalValue: number }[] = [];

        // Battle-specific boosted weights for better rare drops
        const battleWeights: Record<string, Record<string, number>> = {
            highroller: { "mil-spec": 3000, "restricted": 4000, "classified": 2200, "covert": 650, "extraordinary": 150 },
            elite: { "mil-spec": 2500, "restricted": 4000, "classified": 2500, "covert": 800, "extraordinary": 200 },
            sultan: { "restricted": 3000, "classified": 5000, "covert": 1500, "extraordinary": 500 },
            godtier: { "covert": 3000, "extraordinary": 7000 }
        };

        const isCrazyMode = (room as any).crazyMode;
        const BATTLE_PRICE_MULTIPLIER = isCrazyMode ? 0.5 : 2.0;

        for (const participant of participants) {
            const skins = [];
            let totalValue = 0;

            for (let i = 0; i < room.crateCount; i++) {
                const rawSkin = getWeightedSkin(
                    skinsCache || [],
                    room.caseType as CaseType,
                    0,
                    battleWeights,
                    0,
                    isCrazyMode
                );
                const { float, wear } = getSkinFloat();
                const basePrice = getSkinPrice(rawSkin.rarity?.name || "Consumer Grade", float);
                const marketPrice = Math.floor(basePrice * BATTLE_PRICE_MULTIPLIER);

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

        let winnerId: string | null = null;

        if (isTeam && participants.length === 4) {
            // Team calculation: CT (P1 & P3) vs T (P2 & P4) -> Index 0 & 2 vs 1 & 3
            const team1Value = results[0].totalValue + results[2].totalValue;
            const team2Value = results[1].totalValue + results[3].totalValue;

            const team1Wins = (room as any).crazyMode ? team1Value < team2Value : team1Value > team2Value;

            if (team1Wins) {
                // Team 1 wins
                winnerId = "team1"; // Special ID for team win
                const prizePool = results.reduce((sum, r) => sum + r.totalValue, 0);
                const halfPrize = prizePool / 2;

                // Credit P1 & P3
                for (const pid of [results[0].participantId, results[2].participantId]) {
                    const u = await prisma.user.findUnique({ where: { id: pid } });
                    if (u) {
                        const inv = { ...(u.inventory as any) || {} };
                        if (!Array.isArray(inv.csSkins)) inv.csSkins = [];
                        // Distribute skins? For simplicity, we give all skins to winner in 1v1.
                        // In 2v2, maybe give their own skins and split the losers' skins?
                        // Let's stick to the user's requirement: "distribute prize".
                        // Keep simple: Winner team gets all skins in their aggregate inventory.
                        // Actually, let's just mark the winnerId and handle inventory later or now.
                    }
                }
            } else {
                winnerId = "team2";
            }
            // For now, let's just determine winnerId of the individual if we can't do team IDs easily.
            // Better: winnerId is still one person but they represent the team? 
            // Standard approach: winnerId = team ID, but schema says String.
            // Let's use winnerId = results[0].participantId if team 1 wins, etc. to satisfy types.
            winnerId = team1Wins ? results[0].participantId : results[1].participantId;
        } else {
            const winnerObj = results.reduce((best, r) => {
                if ((room as any).crazyMode) {
                    return r.totalValue < best.totalValue ? r : best;
                }
                return r.totalValue > best.totalValue ? r : best;
            });
            winnerId = winnerObj.participantId;
        }

        const winnerUniqueId = winnerId;
        const winnerUser = await prisma.user.findUnique({ where: { id: winnerUniqueId! } });
        if (winnerUser) {
            const inv = { ...(winnerUser.inventory as any) || {} };
            if (!Array.isArray(inv.csSkins)) inv.csSkins = [];

            if (isTeam && participants.length === 4) {
                // If team mode, the "winner" gets all skins from both players on the losing team?
                // Or split between teammates. Let's split skins.
                const winningPids = (winnerId === results[0].participantId)
                    ? [results[0].participantId, results[2].participantId]
                    : [results[1].participantId, results[3].participantId];

                const losingPids = (winnerId === results[0].participantId)
                    ? [results[1].participantId, results[3].participantId]
                    : [results[0].participantId, results[2].participantId];

                // Give team's skins back to themselves + split losers' skins
                const allSkins = results.flatMap(r => r.skins);
                const skinsPerWinner = Math.floor(allSkins.length / 2);

                for (let i = 0; i < winningPids.length; i++) {
                    const pid = winningPids[i];
                    const u = await prisma.user.findUnique({ where: { id: pid } });
                    if (u) {
                        const uInv = { ...(u.inventory as any) || {} };
                        if (!Array.isArray(uInv.csSkins)) uInv.csSkins = [];
                        const start = i * skinsPerWinner;
                        const end = i === (winningPids.length - 1) ? allSkins.length : (i + 1) * skinsPerWinner;
                        uInv.csSkins.push(...allSkins.slice(start, end));
                        await prisma.user.update({ where: { id: pid }, data: { inventory: uInv } });
                    }
                }
            } else {
                for (const result of results) {
                    inv.csSkins.push(...result.skins);
                }
                await prisma.user.update({
                    where: { id: winnerId! },
                    data: { inventory: inv }
                });
            }
        }

        // Add XP to all participants
        for (const p of participants) {
            await addXp(p.id, 500);
        }

        await prisma.battleRoom.update({
            where: { id: roomId },
            data: {
                status: "finished",
                results,
                winnerId: winnerId
            }
        });

        return { success: true, results, winnerId: winnerId };
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
    crazyMode: boolean;
    isTeamMode: boolean;
}) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Silakan login terlebih dahulu." };

    try {
        const caseConfig = CASE_CONFIGS[data.caseType as CaseType];
        if (!caseConfig) return { success: false, error: "Case type tidak valid!" };

        const entryCost = caseConfig.cost * data.crateCount;

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.wallet < entryCost) {
            return { success: false, error: `Saldo tidak cukup! Butuh Rp ${entryCost.toLocaleString()}` };
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { wallet: { decrement: entryCost } }
        });

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
                crazyMode: data.crazyMode,
                isTeamMode: data.isTeamMode,
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

export async function startBattleAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Silakan login terlebih dahulu." };

    try {
        const room = await prisma.battleRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ketemu!" };
        if (room.hostId !== session.user.id) return { success: false, error: "Cuma host yang bisa mulai!" };
        if (room.status !== "waiting") return { success: false, error: "Battle udah jalan/selesai!" };

        const updatedRoom = await prisma.battleRoom.update({
            where: { id: roomId },
            data: { status: "running" }
        });

        revalidatePath("/dashboard/[guildId]/battle", "page");
        return { success: true, room: updatedRoom };
    } catch (error) {
        return { success: false, error: "Gagal mulai battle." };
    }
}

export async function leaveBattleRoomAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Silakan login terlebih dahulu." };

    try {
        const room = await prisma.battleRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ketemu!" };

        const participants = room.participants as any[];
        const isHost = room.hostId === session.user.id;
        const isParticipant = participants.some(p => p.id === session.user.id);

        const caseConfig = CASE_CONFIGS[room.caseType as CaseType];
        const entryCost = caseConfig ? caseConfig.cost * room.crateCount : 0;

        if (room.status === "waiting" && isParticipant && entryCost > 0) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { wallet: { increment: entryCost } }
            });
        }

        if (isHost && room.status === "waiting") {
            await prisma.battleRoom.delete({ where: { id: roomId } });
            revalidatePath("/dashboard/[guildId]/battle", "page");
            return { success: true, action: "removed" };
        }

        const updatedParticipants = participants.filter(p => p.id !== session.user.id);

        if (updatedParticipants.length === 0) {
            await prisma.battleRoom.delete({ where: { id: roomId } });
            revalidatePath("/dashboard/[guildId]/battle", "page");
            return { success: true, action: "removed" };
        }

        const updatedRoom = await prisma.battleRoom.update({
            where: { id: roomId },
            data: {
                participants: updatedParticipants
            }
        });

        revalidatePath("/dashboard/[guildId]/battle", "page");
        return { success: true, action: "updated", room: updatedRoom };
    } catch (error) {
        console.error("[Battle Leave] Error:", error);
        return { success: false, error: "Gagal kabur dari room." };
    }
}

export async function joinBattleRoomAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Silakan login terlebih dahulu." };

    try {
        const room = await prisma.battleRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ketemu!" };
        if (room.status !== "waiting") return { success: false, error: "Battle sudah dimulai atau selesai!" };

        const participants = room.participants as any[];

        if (participants.some(p => p.id === session.user.id)) {
            return { success: true, room, message: "Sudah bergabung." };
        }

        if (participants.length >= room.maxPlayers) {
            return { success: false, error: "Room sudah penuh!" };
        }

        const caseConfig = CASE_CONFIGS[room.caseType as CaseType];
        const entryCost = caseConfig.cost * room.crateCount;

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.wallet < entryCost) {
            return { success: false, error: `Saldo tidak cukup! Butuh ${entryCost.toLocaleString()}` };
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { wallet: { decrement: entryCost } }
        });

        const newParticipant = {
            id: session.user.id,
            name: session.user.name || "Anonymous",
            avatar: session.user.image,
            ready: true
        };

        const updatedRoom = await prisma.battleRoom.update({
            where: { id: roomId },
            data: {
                participants: [...participants, newParticipant]
            }
        });

        revalidatePath("/dashboard/[guildId]/battle", "page");
        return { success: true, room: updatedRoom };
    } catch (error) {
        console.error("[Battle Join] Error:", error);
        return { success: false, error: "Gagal join room." };
    }
}

export async function toggleReadyAction(roomId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Silakan login terlebih dahulu." };

    try {
        const room = await prisma.battleRoom.findUnique({ where: { id: roomId } });
        if (!room) return { success: false, error: "Room gak ketemu!" };

        const participants = room.participants as any[];
        const participantIndex = participants.findIndex(p => p.id === session.user.id);

        if (participantIndex === -1) {
            return { success: false, error: "Kamu bukan peserta room ini!" };
        }

        participants[participantIndex].ready = !participants[participantIndex].ready;

        const updatedRoom = await prisma.battleRoom.update({
            where: { id: roomId },
            data: { participants }
        });

        return { success: true, room: updatedRoom };
    } catch (error) {
        console.error("[Battle Ready] Error:", error);
        return { success: false, error: "Gagal toggle ready." };
    }
}

