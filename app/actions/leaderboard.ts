"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface LeaderboardEntry {
    id: string;
    name: string | null;
    avatar: string | null;
    value: number;
    subValue?: number;
}

export const getWealthLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    const users = await prisma.user.findMany({
        orderBy: [
            { bank: "desc" },
            { wallet: "desc" }
        ],
        take: 20,
        select: {
            id: true,
            name: true,
            avatar: true,
            bank: true,
            wallet: true
        }
    });

    return users.map(u => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        value: u.bank + u.wallet
    })).sort((a, b) => b.value - a.value);
};

export const getLevelLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    const users = await prisma.user.findMany({
        orderBy: [
            { level: "desc" },
            { xp: "desc" }
        ],
        take: 20,
        select: {
            id: true,
            name: true,
            avatar: true,
            level: true,
            xp: true
        }
    });

    return users.map(u => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        value: u.level,
        subValue: u.xp
    }));
};

export const getBattleLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    // Group by winnerId in BattleRoom and count
    const winners = await prisma.battleRoom.groupBy({
        by: ["winnerId"],
        where: {
            status: "finished",
            winnerId: { not: null }
        },
        _count: {
            winnerId: true
        },
        orderBy: {
            _count: {
                winnerId: "desc"
            }
        },
        take: 20
    });

    // Fetch user details for these winners
    const userIds = winners.map(w => w.winnerId as string);
    const users = await prisma.user.findMany({
        where: {
            id: { in: userIds }
        },
        select: {
            id: true,
            name: true,
            avatar: true
        }
    });

    return winners.map(w => {
        const user = users.find(u => u.id === w.winnerId);
        return {
            id: w.winnerId as string,
            name: user?.name || "Unknown",
            avatar: user?.avatar || null,
            value: w._count.winnerId
        };
    });
};
