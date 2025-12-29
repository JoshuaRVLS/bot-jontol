import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet, removeItem, getInventory, claimBounty } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import prisma from "../../utils/Database";
import { getPlayerModifiers, applyBonus, applyCooldown } from "../../utils/economyHelper";
import { generateEconomyResponse } from "../../utils/aiHelper";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("rob")
        .setDescription("Maling duit orang (Awas ditangkep polisi)")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Korban yang mau dimaling")
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("target", true);
        const userId = interaction.user.id;
        const now = new Date();

        if (targetUser.id === userId) return interaction.reply({ content: "Maling diri sendiri? Goblok.", ephemeral: true });
        if (targetUser.bot) return interaction.reply({ content: "Gak bisa maling bot.", ephemeral: true });

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);
            const targetData = await getUserData(targetUser.id);
            const userMods = await getPlayerModifiers(userId);
            const targetMods = await getPlayerModifiers(targetUser.id);

            // Cooldown check
            const lastRobCheck = userData.lastRob ? new Date(userData.lastRob).getTime() : 0;
            const BASE_COOLDOWN = 60 * 60 * 1000; // 1 hour
            const actualCooldownMs = applyCooldown(BASE_COOLDOWN, userMods.cooldownReduction || 0);

            if (now.getTime() - lastRobCheck < actualCooldownMs) {
                const timeLeftMin = Math.ceil((actualCooldownMs - (now.getTime() - lastRobCheck)) / 1000 / 60);
                const aiMsg = await generateEconomyResponse("rob-cooldown", `Lu masih dicari polisi, sisa cooldown ${timeLeftMin} menit.`);
                return interaction.followUp(aiMsg || `Lu masih dicari polisi. Tunggu **${timeLeftMin} menit** lagi.`);
            }

            if (userData.wallet < 10000) {
                return interaction.followUp("Lu butuh minimal **Rp10.000** buat modal maling.");
            }

            if (targetData.wallet < 1000) {
                return interaction.followUp("Target miskin banget, gak worth it dimaling.");
            }

            // High priority: Hard Shield
            const targetInv = await getInventory(targetUser.id);
            if (targetInv["shield"] && targetInv["shield"] > 0) {
                await removeItem(targetUser.id, "shield", 1);
                await prisma.user.update({
                    where: { id: userId },
                    data: { lastRob: now }
                });

                const aiMsg = await generateEconomyResponse("rob-shield", `Target ${targetUser.username} uses Shield (Preman Kampung). Mob beat you up.`);
                return interaction.followUp(aiMsg || `Gagal! ${targetUser.username} punya **Shield**. Shield dia hancur.`);
            }

            // Robbery Logic
            const baseSuccess = 0.4;
            const attackerBonus = userMods.robSuccess || 0;
            const defenderBonus = targetMods.robProtection || 0;

            let finalChance = baseSuccess + attackerBonus - defenderBonus;
            if (finalChance < 0.05) finalChance = 0.05;
            if (finalChance > 0.95) finalChance = 0.95;

            const isSuccess = Math.random() < finalChance;

            // Update cooldown
            await prisma.user.update({
                where: { id: userId },
                data: { lastRob: now }
            });

            if (isSuccess) {
                const percent = (Math.random() * 0.3) + 0.1;
                const stealAmount = Math.floor(targetData.wallet * percent);

                // Check and Claim Bounty
                const bounty = await claimBounty(targetUser.id);
                const bountyReward = bounty ? bounty.reward : 0;

                await removeWallet(targetUser.id, stealAmount);
                await addWallet(userId, stealAmount + bountyReward);

                const aiMsg = await generateEconomyResponse("rob-success", `Stole ${formatRupiah(stealAmount)} from ${targetUser.username}. Win. ${bounty ? 'CLAIMED BOUNTY: ' + formatRupiah(bountyReward) : ''}`);

                let response = aiMsg || `Sukses! Lu dapet dari ${targetUser.username}.`;
                if (bountyReward > 0) {
                    response += `\n🎯 **Bounty:** Dapat tambahan **${formatRupiah(bountyReward)}**!`;
                }

                await interaction.followUp(response);
            } else {
                const fine = 10000;
                const actualFine = userData.wallet < fine ? userData.wallet : fine;
                await removeWallet(userId, actualFine);

                const aiMsg = await generateEconomyResponse("rob-fail", `Caught while robbing ${targetUser.username}. Fine: ${formatRupiah(actualFine)}.`);
                let response = aiMsg || `Ketahuan! Denda **${formatRupiah(actualFine)}** melayang.`;

                await interaction.followUp(response);
            }

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal maling (Error sistem).", ephemeral: true });
        }
    },
} as Command;
