import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import { getUserData, removeWallet, addBank } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Setor duit dari wallet ke bank")
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
                amount = Math.floor(userData.wallet);
            } else {
                amount = parseInt(amountStr);
                if (isNaN(amount) || amount <= 0) {
                    return interaction.followUp({ content: "Masukin angka yang bener dong bang!", ephemeral: true });
                }
            }

            if (userData.wallet < amount) {
                return interaction.followUp({ content: `Duit di wallet lu cuma **${formatRupiah(userData.wallet)}**. Gak cukup buat deposit segitu.`, ephemeral: true });
            }

            await removeWallet(userId, amount);
            await addBank(userId, amount);

            const embed = new EmbedBuilder()
                .setTitle("🏦 Deposit Berhasil!")
                .setDescription(`Lu berhasil setor **${formatRupiah(amount)}** ke bank.`)
                .addFields(
                    { name: "Wallet Sekarang", value: formatRupiah(userData.wallet - amount), inline: true },
                    { name: "Bank Sekarang", value: formatRupiah(userData.bank + amount), inline: true }
                )
                .setColor(0x00FF00)
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error("[Deposit Error]", error);
            await interaction.followUp({ content: "Gagal deposit. Coba lagi nanti.", ephemeral: true });
        }
    },
} as Command;
