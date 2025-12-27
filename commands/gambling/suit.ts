import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("suit")
        .setDescription("Main Batu Gunting Kertas lawan bot")
        .addStringOption(option =>
            option.setName("choice")
                .setDescription("Pilih jagoan lu")
                .setRequired(true)
                .addChoices(
                    { name: "🪨 Batu", value: "batu" },
                    { name: "✂️ Gunting", value: "gunting" },
                    { name: "📄 Kertas", value: "kertas" }
                ))
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Jumlah taruhan")
                .setMinValue(5000)
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const playerChoice = interaction.options.getString("choice", true);
        const amount = interaction.options.getInteger("amount", true);
        const userId = interaction.user.id;

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);
            if (userData.wallet < amount) {
                await interaction.followUp({ content: `Duit cash lu kurang bang! Minimal ada **${formatRupiah(amount)}** di wallet.`, ephemeral: true });
                return;
            }

            const choices = ["batu", "gunting", "kertas"];
            const botChoice = choices[Math.floor(Math.random() * choices.length)];

            // Logic
            // batu > gunting
            // gunting > kertas
            // kertas > batu

            let result = "draw";

            if (playerChoice === botChoice) {
                result = "draw";
            } else if (
                (playerChoice === "batu" && botChoice === "gunting") ||
                (playerChoice === "gunting" && botChoice === "kertas") ||
                (playerChoice === "kertas" && botChoice === "batu")
            ) {
                result = "win";
            } else {
                result = "lose";
            }

            const emojiMap: any = { batu: "🪨", gunting: "✂️", kertas: "📄" };

            let msg = `👾 **SUIT JEPANG (BATU GUNTING KERTAS)** 👾\n\n`;
            msg += `Lu: ${emojiMap[playerChoice]} vs Bot: ${emojiMap[botChoice]}\n`;

            if (result === "win") {
                await addWallet(userId, amount);
                msg += `🎉 **MENANG!** Lu dapet **${formatRupiah(amount)}**!`;
            } else if (result === "lose") {
                await removeWallet(userId, amount);
                msg += `💀 **KALAH!** Duit **${formatRupiah(amount)}** diambil bot.`;
            } else {
                msg += `🤝 **SERI!** Duit aman.`;
            }

            await interaction.followUp(msg);

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Bot bingung mau ngeluarin apa.", ephemeral: true });
        }
    },
} as Command;
