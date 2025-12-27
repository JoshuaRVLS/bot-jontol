import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Lempar dadu (Tebak angka 1-6)")
        .addIntegerOption(option =>
            option.setName("number")
                .setDescription("Tebak angka dadu (1-6)")
                .setMinValue(1)
                .setMaxValue(6)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Jumlah taruhan")
                .setMinValue(5000)
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const guess = interaction.options.getInteger("number", true);
        const amount = interaction.options.getInteger("amount", true);
        const userId = interaction.user.id;

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);

            if (userData.wallet < amount) {
                await interaction.followUp({ content: `Duit cash lu kurang bang!`, ephemeral: true });
                return;
            }

            const result = Math.floor(Math.random() * 6) + 1; // 1-6

            if (guess === result) {
                const winAmount = amount * 5; // x5 reward for exact guess
                await addWallet(userId, winAmount);
                await interaction.followUp(`🎲 Dadu: **${result}**\n🎉 **TEBAKAN BENAR!** Lu menang **${formatRupiah(winAmount)}** (x5)!`);
            } else {
                await removeWallet(userId, amount);
                await interaction.followUp(`🎲 Dadu: **${result}**\n💀 **SALAH TEBAK!** Lu pilih ${guess}. Duit **${formatRupiah(amount)}** melayang.`);
            }

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Dadu ilang.", ephemeral: true });
        }
    },
} as Command;
