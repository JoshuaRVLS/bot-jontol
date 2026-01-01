"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomInt } from "crypto";
import { SYMBOLS, FINAL_PAYLINES, SymbolID } from "@/lib/slots";

const TOTAL_WEIGHT = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

const getRandomSymbol = (): SymbolID => {
    const r = randomInt(0, TOTAL_WEIGHT);
    let cumulative = 0;
    for (const s of SYMBOLS) {
        cumulative += s.weight;
        if (r < cumulative) return s.id;
    }
    return 0; // Fallback
};

export const spinSlotsAction = async (bet: number, isCrazy: boolean = false) => {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Silakan login terlebih dahulu." };

    const userId = session.user.id;
    if (bet < 1000) return { error: "Minimal bet Rp 1.000!" };

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.wallet < bet) return { error: "Saldo gak cukup!" };

        // Deduct bet
        await prisma.user.update({
            where: { id: userId },
            data: { wallet: { decrement: bet } }
        });

        // Generate Grid (3 Rows x 5 Cols)
        // Stored as 1D array of 15 items
        const grid: SymbolID[] = [];
        for (let i = 0; i < 15; i++) {
            grid.push(getRandomSymbol());
        }

        // Calculate Winnings
        let totalPayout = 0;
        const winningLines: { lineIndex: number, symbol: SymbolID, count: number, payout: number }[] = [];

        // Let's use the FINAL_PAYLINES length (9) + 1 virtual for easy math = 10 divisor.
        const divisor = 10;
        const betPerLine = bet / divisor;

        for (let i = 0; i < FINAL_PAYLINES.length; i++) {
            const line = FINAL_PAYLINES[i];
            const firstSymId = grid[line[0]];
            // We need to access SYMBOLS from the lib, ensuring we find it.
            // Since SYMBOLS is imported from lib/slots, it should be available.
            const firstSym = SYMBOLS.find(s => s.id === firstSymId)!;

            // Check matches
            let count = 1;
            let currentSymId = firstSymId;
            let isWildChain = firstSymId === 8; // 8 is Wild

            for (let j = 1; j < line.length; j++) {
                const invalidId = grid[line[j]];

                // Logic with Wilds:
                if (isWildChain) {
                    if (invalidId !== 8) {
                        // End of pure wild chain, stick to this new symbol
                        isWildChain = false;
                        currentSymId = invalidId;
                        count++;
                    } else {
                        // Still wild
                        count++;
                    }
                } else {
                    // Regular chain
                    if (invalidId === currentSymId || invalidId === 8) {
                        count++;
                    } else {
                        break;
                    }
                }
            }

            const payoutSym = SYMBOLS.find(s => s.id === currentSymId)!;
            let multiplier = payoutSym.multiplier[count - 1] || 0;

            if (isCrazy && multiplier > 0) {
                // Crazy Mode: Reduce all payouts significantly (make it harder to win big)
                // Common symbols get tiny payouts, rare symbols get reduced payouts
                if (payoutSym.weight >= 200) {
                    // Common symbols (cherry, lemon): very small payout
                    multiplier = Math.max(1, Math.floor(multiplier * 0.1));
                } else if (payoutSym.weight >= 100) {
                    // Medium symbols: reduced payout
                    multiplier = Math.max(2, Math.floor(multiplier * 0.3));
                } else {
                    // Rare symbols (bar, 7, diamond, wild): moderately reduced
                    multiplier = Math.max(5, Math.floor(multiplier * 0.5));
                }
            }

            if (multiplier > 0) {
                const win = betPerLine * multiplier;
                totalPayout += win;
                winningLines.push({
                    lineIndex: i,
                    symbol: currentSymId,
                    count,
                    payout: win
                });
            }
        }

        // Add to wallet
        if (totalPayout > 0) {
            await prisma.user.update({
                where: { id: userId },
                data: { wallet: { increment: totalPayout } }
            });
        }

        return {
            success: true,
            grid,
            payout: totalPayout,
            winningLines
        };

    } catch (e) {
        console.error(e);
        return { error: "Slot machine rusak. Coba lagi." };
    }
};

