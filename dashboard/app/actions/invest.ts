"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMarketDataAction() {
    try {
        let assets = await prisma.marketAsset.findMany({
            orderBy: { id: "asc" }
        });

        if (assets.length === 0) {
            await seedMarketAction();
            assets = await prisma.marketAsset.findMany({
                orderBy: { id: "asc" }
            });
        }

        return { success: true, assets };
    } catch (error) {
        return { success: false, error: "Gagal ambil data pasar." };
    }
}

export async function seedMarketAction() {
    const ASSET_CONFIGS = [
        { id: "BTC", name: "Bitcoin", type: "crypto", basePrice: 1500000000, volatility: 0.15 },
        { id: "ETH", name: "Ethereum", type: "crypto", basePrice: 40000000, volatility: 0.12 },
        { id: "SOL", name: "Solana", type: "crypto", basePrice: 2000000, volatility: 0.20 },
        { id: "GOTO", name: "GoTo Gojek Tokopedia", type: "stock", basePrice: 50, volatility: 0.08 },
        { id: "BBCA", name: "Bank Central Asia", type: "stock", basePrice: 10000, volatility: 0.03 },
        { id: "TLKM", name: "Telkom Indonesia", type: "stock", basePrice: 3000, volatility: 0.04 },
        { id: "ASII", name: "Astra International", type: "stock", basePrice: 5000, volatility: 0.05 },
    ];

    try {
        const operations = ASSET_CONFIGS.map(asset =>
            prisma.marketAsset.upsert({
                where: { id: asset.id },
                update: {},
                create: {
                    id: asset.id,
                    name: asset.name,
                    type: asset.type,
                    price: asset.basePrice,
                    lastPrice: asset.basePrice,
                    volatility: asset.volatility,
                    priceHistory: [asset.basePrice]
                }
            })
        );
        await Promise.all(operations);
        return { success: true };
    } catch (error) {
        console.error("Seed error:", error);
        return { success: false, error: "Gagal seeding market." };
    }
}

export async function buyAssetAction(assetId: string, moneyAmount: number) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu bang!" };

    if (moneyAmount < 1000) return { success: false, error: "Minimal beli Rp 1.000 bang." };

    try {
        const [user, asset] = await Promise.all([
            prisma.user.findUnique({ where: { id: session.user.id } }),
            prisma.marketAsset.findUnique({ where: { id: assetId } })
        ]);

        if (!user) return { success: false, error: "User gak ketemu!" };
        if (!asset) return { success: false, error: "Aset gak valid!" };
        if (user.wallet < moneyAmount) return { success: false, error: "Duit lu kurang bang!" };

        const buyAmount = moneyAmount / asset.price;
        const currentInvestments = (user.investments as Record<string, number>) || {};
        currentInvestments[assetId] = (currentInvestments[assetId] || 0) + buyAmount;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                wallet: { decrement: moneyAmount },
                investments: currentInvestments
            }
        });

        revalidatePath("/dashboard/[guildId]/invest", "page");
        return { success: true, amount: buyAmount };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Gagal beli aset." };
    }
}

export async function sellAssetAction(assetId: string, moneyAmount: number) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { success: false, error: "Login dulu bang!" };

    try {
        const [user, asset] = await Promise.all([
            prisma.user.findUnique({ where: { id: session.user.id } }),
            prisma.marketAsset.findUnique({ where: { id: assetId } })
        ]);

        if (!user) return { success: false, error: "User gak ketemu!" };
        if (!asset) return { success: false, error: "Aset gak valid!" };

        const currentInvestments = (user.investments as Record<string, number>) || {};
        const currentHolding = currentInvestments[assetId] || 0;
        const amountToSell = moneyAmount / asset.price;

        if (currentHolding < amountToSell) {
            return { success: false, error: "Aset lu gak cukup bang!" };
        }

        currentInvestments[assetId] = currentHolding - amountToSell;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                wallet: { increment: moneyAmount },
                investments: currentInvestments
            }
        });

        revalidatePath("/dashboard/[guildId]/invest", "page");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Gagal jual aset." };
    }
}
