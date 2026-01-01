
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Main slot mesin (Jackpot x10)")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Jumlah taruhan")
                .setMinValue(5000)
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const amount = interaction.options.getInteger("amount", true);
        const userId = interaction.user.id;

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);

            if (userData.wallet < amount) {
                await interaction.followUp({ content: `Duit cash lu kurang bang!`, ephemeral: true });
                return;
            }

            // Remove money first
            await removeWallet(userId, amount);

            const items = ["🍒", "🍋", "🍇", "🍉", "💎", "7️⃣"];

            // Spinning animation
            for (let i = 0; i < 3; i++) {
                const spinRow = [
                    items[Math.floor(Math.random() * items.length)],
                    items[Math.floor(Math.random() * items.length)],
                    items[Math.floor(Math.random() * items.length)]
                ];
                await interaction.editReply(`🎰 ** SPINNING... ** 🎰\n------------------\n| ${spinRow[0]} | ${spinRow[1]} | ${spinRow[2]} |\n------------------`);
                await new Promise(r => setTimeout(r, 600));
            }

            // Generate 3 final random items
            const row = [];
            for (let i = 0; i < 3; i++) {
                row.push(items[Math.floor(Math.random() * items.length)]);
            }

            const resultString = `| ${row[0]} | ${row[1]} | ${row[2]} | `;

            let multiplier = 0;
            // Winning Logic (Aimed for ~100% RTP / Fair Play)
            if (row[0] === row[1] && row[1] === row[2]) {
                // Triple match
                if (row[0] === "💎") multiplier = 25;
                else if (row[0] === "7️⃣") multiplier = 15;
                else multiplier = 5;
            } else if (row[0] === row[1] || row[1] === row[2] || row[0] === row[2]) {
                // Double match (Win amount is 1.8x)
                multiplier = 1.8;
            }

            const winAmount = Math.floor(amount * multiplier);

            let msg = `🎰 ** SLOTS MACHINE ** 🎰\n------------------\n${resultString} \n------------------\n`;

            if (multiplier > 0) {
                await addWallet(userId, winAmount);
                msg += `\n ** JACKPOT! ** Lu menang ** ${formatRupiah(winAmount)}** !(x${multiplier})`;
            } else {
                msg += `\n ** ZONK! ** Lu kalah ** ${formatRupiah(amount)}**.Coba lagi!`;
            }

            await interaction.editReply(msg);

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Mesin slot macet.", ephemeral: true });
        }
    },
} as Command;
