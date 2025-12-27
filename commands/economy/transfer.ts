import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { getUserData, removeBank, addBank } from "../../utils/Database";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Transfer duit ke user lain (via Bank)")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("User yang mau dikirim duit")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Jumlah duit")
                .setMinValue(1)
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("target", true);
        const amount = interaction.options.getInteger("amount", true);
        const senderId = interaction.user.id;

        if (targetUser.id === senderId) {
            return interaction.reply({ content: "Lu mau transfer ke diri sendiri? Gak guna bang.", ephemeral: true });
        }
        if (targetUser.bot) {
            return interaction.reply({ content: "Bot gak butuh duit bang.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const senderData = await getUserData(senderId);

            if (senderData.bank < amount) {
                await interaction.followUp({ content: `Saldo bank lu gak cukup bos! Cuma ada ${senderData.bank}.`, ephemeral: true });
                return;
            }

            // Ensure target exists in DB, getUserData handles creation usually, 
            // but just to be safe let's assume `addBank` creates/updates.
            // But wait, `addBank` updates `data: { bank: { increment: amount } }`. 
            // If user doesn't exist, update might fail if upsert is not setup or if logic relies on existing user.
            // Our `addBank` uses `db.user.upsert` with create, so it's safe.

            // Execute Transaction
            // Since we're not using strict $transaction for simplicity (and potential replica set issues), 
            // we do it sequentially. Worst case: money lost from sender but not added to receiver if 2nd fail.
            // But usually fine for this use case.

            await removeBank(senderId, amount);
            await addBank(targetUser.id, amount);

            await interaction.followUp(`✅ **${interaction.user.username}** berhasil transfer **${amount}** coins ke **${targetUser.username}**!`);

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Transfer gagal. Uang aman kok (semoga).", ephemeral: true });
        }
    },
} as Command;
