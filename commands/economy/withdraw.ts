import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import { getUserData, addWallet, removeBank } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Ambil duit dari bank ke wallet")
        .addStringOption(option =>
            option.setName("amount")
                .setDescription("Jumlah duit (atau 'all' untuk semuanya)")
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const amountStr = interaction.options.getString("amount", true);
        const userId = interaction.user.id;

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);

            let amount: number;
            if (amountStr.toLowerCase() === "all") {
                amount = Math.floor(userData.bank);
            } else {
                amount = parseInt(amountStr);
                if (isNaN(amount) || amount <= 0) {
                    return interaction.followUp({ content: "Masukin angka yang bener dong bang!", ephemeral: true });
                }
            }

            if (userData.bank < amount) {
                return interaction.followUp({ content: `Saldo bank lu cuma **${formatRupiah(userData.bank)}**. Gak cukup buat tarik segitu.`, ephemeral: true });
            }

            await removeBank(userId, amount);
            await addWallet(userId, amount);

            const embed = new EmbedBuilder()
                .setTitle("💸 Withdraw Berhasil!")
                .setDescription(`Lu berhasil tarik **${formatRupiah(amount)}** dari bank.`)
                .addFields(
                    { name: "Wallet Sekarang", value: formatRupiah(userData.wallet + amount), inline: true },
                    { name: "Bank Sekarang", value: formatRupiah(userData.bank - amount), inline: true }
                )
                .setColor(0xFFA500)
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error("[Withdraw Error]", error);
            await interaction.followUp({ content: "Gagal withdraw. Coba lagi nanti.", ephemeral: true });
        }
    },
} as Command;
