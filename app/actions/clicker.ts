"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addXp } from "@/lib/leveling";

interface ClickData {
    timestamps: number[];
    totalClicks: number;
    flagCount: number;
    lastReset: number;
}

const clickerData = new Map<string, ClickData>();

const CLICK_COOLDOWN_MS = 50;
const MAX_CPS = 15;
const TIME_WINDOW_MS = 10000;
const MAX_CLICKS_PER_WINDOW = 150;
const VARIANCE_THRESHOLD = 5;
const FLAG_THRESHOLD = 5;

const getVariance = (intervals: number[]): number => {
    if (intervals.length < 3) return 999;
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const squaredDiffs = intervals.map(val => Math.pow(val - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / intervals.length);
};

const detectMacro = (timestamps: number[]): boolean => {
    if (timestamps.length < 10) return false;

    const intervals: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1]);
    }

    const variance = getVariance(intervals);

    if (variance < VARIANCE_THRESHOLD) {
        return true;
    }

    const recentIntervals = intervals.slice(-20);
    const avgInterval = recentIntervals.reduce((a, b) => a + b, 0) / recentIntervals.length;

    if (avgInterval < 1000 / MAX_CPS && variance < 10) {
        return true;
    }

    return false;
};

export const processClick = async (multiplier: number = 1): Promise<{
    success: boolean;
    earned?: number;
    newWallet?: number;
    error?: string;
    flagged?: boolean;
    isCrit?: boolean;
    isJackpot?: boolean;
    jackpotAmount?: number;
}> => {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    const now = Date.now();

    let userData = clickerData.get(userId);
    if (!userData || now - userData.lastReset > 60000) {
        userData = {
            timestamps: [],
            totalClicks: 0,
            flagCount: 0,
            lastReset: now,
        };
        clickerData.set(userId, userData);
    }

    userData.timestamps = userData.timestamps.filter(t => now - t < TIME_WINDOW_MS);

    if (userData.timestamps.length > 0) {
        const lastClick = userData.timestamps[userData.timestamps.length - 1];
        if (now - lastClick < CLICK_COOLDOWN_MS) {
            return { success: false, error: "Terlalu cepat!" };
        }
    }

    if (userData.timestamps.length >= MAX_CLICKS_PER_WINDOW) {
        userData.flagCount++;
        if (userData.flagCount >= FLAG_THRESHOLD) {
            return { success: false, error: "Rate limit exceeded. Santai.", flagged: true };
        }
        return { success: false, error: "Sabar, tunggu sebentar." };
    }

    userData.timestamps.push(now);

    if (detectMacro(userData.timestamps)) {
        userData.flagCount++;
        if (userData.flagCount >= FLAG_THRESHOLD) {
            return { success: false, error: "Macro detected! Klik manual aja.", flagged: true };
        }
        return { success: false, error: "Klik pattern mencurigakan..." };
    }

    userData.totalClicks++;

    // Game Logic moved to Server
    const baseEarning = 100;
    const variance = 0.5 + Math.random();
    let earned = Math.floor(baseEarning * multiplier * variance);

    const isCrit = Math.random() < 0.15;
    const isJackpot = Math.random() < 0.005;
    let jackpotAmount = 0;

    if (isCrit) {
        earned = Math.floor(earned * 2);
    }

    if (isJackpot) {
        jackpotAmount = Math.floor(10000 + Math.random() * 40000);
        earned += jackpotAmount;
    }

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                wallet: { increment: earned },
            },
        });

        // Add XP every 20 clicks: 50-100 XP
        if (userData.totalClicks % 20 === 0) {
            const xpToGain = 50 + Math.floor(Math.random() * 51);
            await addXp(userId, xpToGain);
        }

        return {
            success: true,
            earned,
            newWallet: user.wallet,
            isCrit,
            isJackpot,
            jackpotAmount
        };
    } catch (error) {
        console.error("[Clicker Action Error]", error);
        return { success: false, error: "Failed to process click" };
    }
};

export const getClickerStats = async (): Promise<{
    wallet: number;
} | null> => {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { wallet: true },
    });

    return user ? { wallet: user.wallet } : null;
};

