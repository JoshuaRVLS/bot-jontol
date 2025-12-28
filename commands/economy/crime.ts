import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import prisma from "../../utils/Database";
import { getPlayerModifiers, applyBonus, applyCooldown } from "../../utils/economyHelper";
import { generateEconomyResponse } from "../../utils/aiHelper";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("crime")
        .setDescription("Lakukan kejahatan (High Risk High Reward)"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const userId = interaction.user.id;
        const now = new Date();

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);
            const mods = await getPlayerModifiers(userId);

            // Cooldown 30 mins base
            const lastCrimeCheck = userData.lastCrime ? new Date(userData.lastCrime).getTime() : 0;
            const BASE_COOLDOWN_MS = 30 * 60 * 1000;
            const actualCooldownMs = applyCooldown(BASE_COOLDOWN_MS, mods.cooldownReduction || 0);

            if (now.getTime() - lastCrimeCheck < actualCooldownMs) {
                const timeLeftSec = Math.ceil((actualCooldownMs - (now.getTime() - lastCrimeCheck)) / 1000);
                const minutesLeft = Math.floor(timeLeftSec / 60);

                const aiMsg = await generateEconomyResponse("crime-cooldown", `Polisi lagi patroli, sisa cooldown ${minutesLeft} menit.`);
                return interaction.followUp(aiMsg || `🚫 **COOLDOWN!** Sembunyi dulu **${minutesLeft} menit**.`);
            }

            const baseChance = 0.45;
            const finalChance = baseChance + (mods.crimeSuccess || 0);
            const success = Math.random() < finalChance;

            // Scenario picks for AI context
            const crimes = ["rampok bank", "jual barang ilegal", "hack ATM", "nyolong motor", "nyolong jemuran"];
            const scenario = crimes[Math.floor(Math.random() * crimes.length)];

            // Update cooldown
            await prisma.user.update({
                where: { id: userId },
                data: { lastCrime: now }
            });

            if (success) {
                const baseReward = Math.floor(Math.random() * (50000 - 15000 + 1)) + 15000;
                const reward = applyBonus(baseReward, mods.crimePayout || 0);
                await addWallet(userId, reward);

                const aiMsg = await generateEconomyResponse("crime-success", `Crime: ${scenario}, Reward: ${formatRupiah(reward)}.`);
                let response = aiMsg || `😈 **SUKSES!** Lu dapet **${formatRupiah(reward)}**!`;

                if (mods.crimePayout && mods.crimePayout > 0) {
                    response += `\n✨ (Bonus Item: +${Math.round(mods.crimePayout * 100)}%)`;
                }

                await interaction.followUp(response);
            } else {
                const fine = 15000;
                const actualFine = userData.wallet < fine ? userData.wallet : fine;

                await removeWallet(userId, actualFine);

                const aiMsg = await generateEconomyResponse("crime-fail", `Crime: ${scenario}, Fine: ${formatRupiah(actualFine)}. Got caught by police.`);
                await interaction.followUp(aiMsg || `🚔 **GAGAL!** Lu ketangkep dan denda **${formatRupiah(actualFine)}**.`);
            }

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal berbuat jahat.", ephemeral: true });
        }
    },
} as Command;
