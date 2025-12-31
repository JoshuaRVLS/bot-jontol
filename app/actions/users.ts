"use server";

import { prisma } from "@/lib/prisma";
import { checkIsDeveloper } from "./developer";

export interface UserData {
    id: string;
    name: string | null;
    wallet: number;
    bank: number;
    inventory: Record<string, any>;
    investments: Record<string, any>;
    scPity: number;
    createdAt: Date;
}

export const searchUsers = async (query: string): Promise<UserData[]> => {
    const isDev = await checkIsDeveloper();
    if (!isDev) return [];

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { id: { contains: query } },
                { name: { contains: query, mode: "insensitive" } },
            ],
        },
        take: 20,
        orderBy: { createdAt: "desc" },
    });

    return users.map((u) => ({
        id: u.id,
        name: u.name,
        wallet: u.wallet,
        bank: u.bank,
        inventory: (u.inventory as Record<string, any>) || {},
        investments: (u.investments as Record<string, any>) || {},
        scPity: u.scPity,
        createdAt: u.createdAt,
    }));
};

export const getUserById = async (userId: string): Promise<UserData | null> => {
    const isDev = await checkIsDeveloper();
    if (!isDev) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) return null;

    return {
        id: user.id,
        name: user.name,
        wallet: user.wallet,
        bank: user.bank,
        inventory: (user.inventory as Record<string, any>) || {},
        investments: (user.investments as Record<string, any>) || {},
        scPity: user.scPity,
        createdAt: user.createdAt,
    };
};

export const updateUserBalance = async (
    userId: string,
    wallet: number,
    bank: number
): Promise<{ success: boolean; error?: string }> => {
    const isDev = await checkIsDeveloper();
    if (!isDev) return { success: false, error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { wallet, bank },
        });
        return { success: true };
    } catch {
        return { success: false, error: "Failed to update balance" };
    }
};

export const updateUserPity = async (
    userId: string,
    scPity: number
): Promise<{ success: boolean; error?: string }> => {
    const isDev = await checkIsDeveloper();
    if (!isDev) return { success: false, error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { scPity },
        });
        return { success: true };
    } catch {
        return { success: false, error: "Failed to update pity" };
    }
};

export const updateUserInventory = async (
    userId: string,
    inventory: Record<string, any>
): Promise<{ success: boolean; error?: string }> => {
    const isDev = await checkIsDeveloper();
    if (!isDev) return { success: false, error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { inventory },
        });
        return { success: true };
    } catch {
        return { success: false, error: "Failed to update inventory" };
    }
};

export const clearUserSkins = async (
    userId: string
): Promise<{ success: boolean; error?: string }> => {
    const isDev = await checkIsDeveloper();
    if (!isDev) return { success: false, error: "Unauthorized" };

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { success: false, error: "User not found" };

        const inventory = (user.inventory as Record<string, any>) || {};
        inventory.csSkins = [];

        await prisma.user.update({
            where: { id: userId },
            data: { inventory },
        });
        return { success: true };
    } catch {
        return { success: false, error: "Failed to clear skins" };
    }
};

export const resetUserData = async (
    userId: string
): Promise<{ success: boolean; error?: string }> => {
    const isDev = await checkIsDeveloper();
    if (!isDev) return { success: false, error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                wallet: 100000,
                bank: 0,
                scPity: 0,
                inventory: {},
                investments: {},
            },
        });
        return { success: true };
    } catch {
        return { success: false, error: "Failed to reset user" };
    }
};
