import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Judi koin (Heads/Tails)")
        .addStringOption(option =>
            option.setName("side")
                .setDescription("Pilih sisi koin")
                .setRequired(true)
                .addChoices(
                    { name: "Heads (Kepala)", value: "heads" },
                    { name: "Tails (Ekor)", value: "tails" }
                ))
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Jumlah taruhan")
                .setMinValue(5000)
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const side = interaction.options.getString("side", true);
        const amount = interaction.options.getInteger("amount", true);
        const userId = interaction.user.id;

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);

            if (userData.wallet < amount) {
                await interaction.followUp({ content: `Duit cash lu kurang bang! Minimal ada **${formatRupiah(amount)}** di wallet.`, ephemeral: true });
                return;
            }

            const result = Math.random() < 0.5 ? "heads" : "tails";
            const isWin = side === result;

            if (isWin) {
                await addWallet(userId, amount); // Win: Get original + amount
                await interaction.followUp(`🟢 **MENANG!** Koin mendarat di **${result.toUpperCase()}**.\nLu dapet **${formatRupiah(amount)}**!`);
            } else {
                await removeWallet(userId, amount);
                await interaction.followUp(`🔴 **KALAH!** Koin mendarat di **${result.toUpperCase()}**.\nDuit **${formatRupiah(amount)}** melayang.`);
            }

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Error pas judi. Bandar kabur.", ephemeral: true });
        }
    },
} as Command;
