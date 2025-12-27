import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet, removeItem, getInventory } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

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

            // Cooldown check (e.g. 1 hour)
            const lastRobCheck = userData.lastRob ? new Date(userData.lastRob).getTime() : 0;
            const cooldown = 60 * 60 * 1000; // 1 hour

            if (now.getTime() - lastRobCheck < cooldown) {
                const timeLeft = Math.ceil((cooldown - (now.getTime() - lastRobCheck)) / 1000 / 60);
                return interaction.followUp(`🚫 **COOLDOWN!** Lu masih buronan. Tunggu **${timeLeft} menit** lagi.`);
            }

            // Check if user has enough money to pay fine if caught (min 10k)
            if (userData.wallet < 10000) {
                return interaction.followUp("Lu butuh minimal **Rp10.000** buat modal maling (bwat bayar denda kalo ketangkep).");
            }

            // Check target wallet
            if (targetData.wallet < 1000) {
                return interaction.followUp("Target miskin banget, gak worth it dimaling.");
            }

            // Check Shield
            const targetInv = await getInventory(targetUser.id);
            if (targetInv["shield"] && targetInv["shield"] > 0) {
                // Shield logic: 50% chance to block completely, 50% chance it fails? 
                // Description said 50% chance break. Let's make it always block but break 50% of time?
                // Or "Melindungi... (1x pakai)".
                // Let's make it simple: Shield BLOCKS the rob automatically, and is consumed.

                await removeItem(targetUser.id, "shield", 1);

                // Update cooldown for robber
                await prisma.user.update({
                    where: { id: userId },
                    data: { lastRob: now } // Cooldown triggers even on fail
                });

                return interaction.followUp(`🛡️ **GAGAL!** ${targetUser.username} pake **Preman Kampung (Shield)**! Preman-nya ngegebugin lu. Shield dia ancur.`);
            }

            // Robbery Logic
            const successChance = 0.4; // 40% base success
            // Check Lockpick benefit
            const userInv = await getInventory(userId);
            const hasLockpick = userInv["lockpick"] && userInv["lockpick"] > 0;

            const finalChance = hasLockpick ? successChance + 0.1 : successChance;

            const isSuccess = Math.random() < finalChance;

            if (isSuccess) {
                // Steal percentage (10% - 40% of wallet)
                const percent = (Math.random() * 0.3) + 0.1;
                const stealAmount = Math.floor(targetData.wallet * percent);

                await removeWallet(targetUser.id, stealAmount);
                await addWallet(userId, stealAmount);

                await interaction.followUp(`😈 **SUKSES!** Lu berhasil maling **${formatRupiah(stealAmount)}** dari dompet ${targetUser.username}!`);
            } else {
                // Fail: Pay fine
                const fine = 10000;
                await removeWallet(userId, fine);

                await interaction.followUp(`👮 **KETANGKEP!** Polisi nangkep lu. Denda **${formatRupiah(fine)}** harus dibayar.`);
            }

            // Update cooldown
            await prisma.user.update({
                where: { id: userId },
                data: { lastRob: now }
            });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal maling (Error sistem).", ephemeral: true });
        }
    },
} as Command;
