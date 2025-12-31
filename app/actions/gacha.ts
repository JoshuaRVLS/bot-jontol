"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CaseType, CASE_CONFIGS, getWeightedSkin, getSkinFloat, getSkinPrice } from "@/lib/csgo";
import { getSkins } from "@/lib/skins";
import { revalidatePath } from "next/cache";
import { addXp } from "@/lib/leveling";

export async function openCaseAction(guildId: string, caseId: CaseType, amount: number = 1) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const userId = session.user.id;
    const config = CASE_CONFIGS[caseId];

    if (!config) return { error: "Case gak valid bang!" };
    if (amount <= 0 || amount > 50) return { error: "Jumlah gacha gak valid (1-50)!" };

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return { error: "User gak ketemu!" };

        const totalCost = config.cost * amount;
        if (user.wallet < totalCost) {
            return { error: `Saldo wallet lu gak cukup bang. Gacha ${amount}x butuh Rp ${totalCost.toLocaleString()}` };
        }

        const skinsCache = await getSkins();
        let currentPity = (user as any).scPity || 0;
        const results = [];

        const guildConfig = await prisma.guildConfig.findUnique({
            where: { guildId }
        });
        const customWeights = guildConfig?.gachaConfig;

        for (let i = 0; i < amount; i++) {
            // Perform Gacha
            const rawSkin = getWeightedSkin(skinsCache || [], caseId, currentPity, customWeights);
            const { float, wear } = getSkinFloat();
            const marketPrice = getSkinPrice(rawSkin.rarity?.name || "Consumer Grade", float);
            const rarity = rawSkin.rarity?.name?.toLowerCase() || "";

            if (rarity.includes("covert") || rarity.includes("extraordinary") || rarity.includes("gold") || rarity.includes("rare special")) {
                currentPity = 0;
            } else {
                currentPity++;
            }

            const fullName = `${rawSkin.weapon?.name} | ${rawSkin.pattern?.name}`;

            const skinData = {
                ...rawSkin,
                name: fullName,
                marketPrice,
                float,
                wear,
                instanceId: `${rawSkin.id}_${Date.now()}_${Math.random().toString(36).substring(2, 4)}_${i}`,
                obtainedAt: new Date().toISOString()
            };
            results.push(skinData);
        }

        // Update DB: Deduct money, Update Pity, Add Skins to Inventory
        const inv = { ...(user.inventory as any) || {} };
        if (!Array.isArray(inv.csSkins)) {
            inv.csSkins = [];
        }
        inv.csSkins.push(...results);

        await prisma.user.update({
            where: { id: userId },
            data: {
                wallet: { decrement: totalCost },
                scPity: currentPity,
                inventory: inv
            } as any
        });

        // Add XP: 100 per case
        await addXp(userId, amount * 100);

        return {
            success: true,
            skins: results,
            bestSkin: [...results].sort((a, b) => b.marketPrice - a.marketPrice)[0]
        };

    } catch (error) {
        console.error("[Gacha Action Error]", error);
        return { error: "Gagal memproses transaksi gacha." };
    }
}

export async function sellSkinsAction(instanceIds: string[]) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const userId = session.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return { error: "User gak ketemu!" };

        const inv = { ...(user.inventory as any) || {} };
        if (!Array.isArray(inv.csSkins)) {
            return { error: "Inventory lu kosong bang!" };
        }

        const skinsToSell = inv.csSkins.filter((s: any) => instanceIds.includes(s.instanceId));
        if (skinsToSell.length === 0) return { error: "Skin gak ketemu buat dijual!" };

        const totalValue = skinsToSell.reduce((acc: number, s: any) => acc + (s.marketPrice || 0), 0);

        // Remove from inventory
        inv.csSkins = inv.csSkins.filter((s: any) => !instanceIds.includes(s.instanceId));

        await prisma.user.update({
            where: { id: userId },
            data: {
                wallet: { increment: totalValue },
                inventory: inv
            } as any
        });

        return { success: true, totalValue };
    } catch (error) {
        console.error("[Sell Action Error]", error);
        return { error: "Gagal jual skin bang." };
    }
}

export async function getGuildGachaConfig(guildId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    try {
        const config = await prisma.guildConfig.findUnique({
            where: { guildId }
        });

        return { success: true, config: config?.gachaConfig || null };
    } catch (error) {
        console.error("[Get Gacha Config Error]", error);
        return { error: "Gagal ambil config gacha bang." };
    }
}

export async function updateGuildGachaConfig(guildId: string, config: any) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    // Basic validation: ensure it's an object and has the expected case types
    if (typeof config !== "object" || config === null) {
        return { error: "Config gak valid bang!" };
    }

    try {
        await prisma.guildConfig.upsert({
            where: { guildId },
            update: { gachaConfig: config },
            create: { guildId, gachaConfig: config }
        });

        revalidatePath(`/dashboard/${guildId}/gacha/config`);
        return { success: true };
    } catch (error) {
        console.error("[Update Gacha Config Error]", error);
        return { error: "Gagal update config gacha bang." };
    }
}

export async function getUserGachaConfig(userId: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { gachaConfig: true }
        });

        return { success: true, config: user?.gachaConfig || null };
    } catch (error) {
        console.error("[Get User Gacha Config Error]", error);
        return { error: "Gagal ambil config user bang." };
    }
}

export async function updateUserGachaConfig(userId: string, config: any) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { gachaConfig: config }
        });

        return { success: true };
    } catch (error) {
        console.error("[Update User Gacha Config Error]", error);
        return { error: "Gagal update config user bang." };
    }
}

export async function searchUsersAction(query: string) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { id: { contains: query } },
                    { name: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 10,
            select: { id: true, name: true, avatar: true }
        });

        return { success: true, users };
    } catch (error) {
        console.error("[Search Users Error]", error);
        return { error: "Gagal cari user bang." };
    }
}
