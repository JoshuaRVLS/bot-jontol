import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData } from "../../utils/Database";
import db from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { getPlayerModifiers, applyBonus, applyCooldown } from "../../utils/economyHelper";
import { generateEconomyResponse } from "../../utils/aiHelper";

const BASE_DAILY_AMOUNT = 50000;

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Klaim duit harian gratis!"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const userId = interaction.user.id;
        const user = await getUserData(userId);
        const mods = await getPlayerModifiers(userId);
        const now = new Date();

        const BASE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
        const actualCooldownMs = applyCooldown(BASE_COOLDOWN_MS, mods.cooldownReduction || 0);

        if (user.lastDaily) {
            const lastDaily = new Date(user.lastDaily);
            const diffTime = now.getTime() - lastDaily.getTime();

            if (diffTime < actualCooldownMs) {
                const timeLeftMs = actualCooldownMs - diffTime;
                const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));

                const aiMsg = await generateEconomyResponse("daily-cooldown", `Gak boleh maruk, sisa cooldown ${hoursLeft} jam.`);
                return interaction.followUp({ content: aiMsg || `Sabar bang. Bisa klaim lagi dalam ${hoursLeft} jam.`, ephemeral: true });
            }

            // Streak check: If last daily was more than 48 hours ago, reset streak
            const isStreakReset = diffTime > (48 * 60 * 60 * 1000);
            await db.user.update({
                where: { id: userId },
                data: {
                    dailyStreak: isStreakReset ? 1 : { increment: 1 }
                }
            });
        } else {
            // First time ever
            await db.user.update({
                where: { id: userId },
                data: { dailyStreak: 1 }
            });
        }

        try {
            const updatedUser = await getUserData(userId);
            const streak = updatedUser.dailyStreak || 1;
            const streakBonus = Math.min(streak * 0.05, 1.0); // max 100% bonus at 20 days

            const baseAmount = applyBonus(BASE_DAILY_AMOUNT, mods.dailyBonus || 0);
            const amount = Math.floor(baseAmount * (1 + streakBonus));

            await addWallet(userId, amount);
            await db.user.update({
                where: { id: userId },
                data: { lastDaily: now }
            });

            const aiMsg = await generateEconomyResponse("daily", `Daily claim! Streak: ${streak} days. Reward: ${formatRupiah(amount)}. Bonus from streak: ${Math.round(streakBonus * 100)}%.`);
            let response = aiMsg || `Berhasil klaim **${formatRupiah(amount)}** hari ini.`;

            response += `\nStreak: ${streak} hari (+${Math.round(streakBonus * 100)}% bonus)`;

            await interaction.followUp(response);
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Waduh error pas ngasih duit. Coba lagi nanti.", ephemeral: true });
        }
    },
} as Command;
