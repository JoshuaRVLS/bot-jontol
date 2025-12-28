import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("roulette")
        .setDescription("Main Roulette (Red/Black/Green/Number)")
        .addStringOption(option =>
            option.setName("bet")
                .setDescription("Pasang taruhan (red, black, green, atau angka 0-36)")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Jumlah taruhan")
                .setMinValue(5000)
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const bet = interaction.options.getString("bet", true).toLowerCase();
        const amount = interaction.options.getInteger("amount", true);
        const userId = interaction.user.id;

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);
            if (userData.wallet < amount) {
                await interaction.followUp({ content: `Duit cash lu kurang bang! Minimal ada **${formatRupiah(amount)}** di wallet.`, ephemeral: true });
                return;
            }

            // Remove bet amount first
            await removeWallet(userId, amount);

            // Roulette Logic
            // Numbers: 0-36
            // 0: Green
            // Red: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
            // Black: 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35

            const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

            let resultNumber: number;
            let resultColor: string;

            // Fairness adjustment: If betting color, we ensure 50:50 by rerolling if 0 hits 
            // OR we can just use 1-36 for color bets.
            const isColorBet = ["red", "black"].includes(bet);

            if (isColorBet) {
                // 50:50 logic for Red/Black (1-36 only)
                resultNumber = Math.floor(Math.random() * 36) + 1;
            } else {
                // Standard 0-36 roll for numbers/green
                resultNumber = Math.floor(Math.random() * 37);
            }

            if (resultNumber === 0) resultColor = "green";
            else if (redNumbers.includes(resultNumber)) resultColor = "red";
            else resultColor = "black";

            let won = false;
            let multiplier = 0;

            // Check Win
            if (bet === "red" && resultColor === "red") {
                won = true;
                multiplier = 2;
            } else if (bet === "black" && resultColor === "black") {
                won = true;
                multiplier = 2;
            } else if (bet === "green" && resultColor === "green") {
                won = true;
                multiplier = 37; // Fair reward for 1/37 chance
            } else {
                // Number bet
                const numberBet = parseInt(bet);
                if (!isNaN(numberBet) && numberBet >= 0 && numberBet <= 36) {
                    if (numberBet === resultNumber) {
                        won = true;
                        multiplier = 37; // Fair reward
                    }
                }
            }

            // Message Construction
            let colorEmoji = "🟩";
            if (resultColor === "red") colorEmoji = "🟥";
            if (resultColor === "black") colorEmoji = "⬛";

            let msg = `🎡 **ROULETTE** 🎡\nBola berhenti di: ${colorEmoji} **${resultNumber}** (${resultColor.toUpperCase()})\n\n`;

            if (won) {
                const winAmount = amount * multiplier;
                await addWallet(userId, winAmount);
                msg += `🎉 **MENANG!** Lu pasang **${bet}**. Dapet **${formatRupiah(winAmount)}**! (x${multiplier})`;
            } else {
                msg += `💀 **KALAH!** Lu pasang **${bet}**. Duit **${formatRupiah(amount)}** ludes.`;
            }

            await interaction.followUp(msg);

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Error pas main roulette.", ephemeral: true });
        }
    },
} as Command;
