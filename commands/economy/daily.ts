import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData } from "../../utils/Database";
import db from "../../utils/Database";

const DAILY_AMOUNT = 50000;

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Klaim duit harian gratis!"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const userId = interaction.user.id;
        const user = await getUserData(userId);

        const now = new Date();
        // Check if Last Daily exists and if it was claimed today (simple 24h check or calendar day?)
        // Using 24h check for now.

        if (user.lastDaily) {
            const lastDaily = new Date(user.lastDaily);
            const diffTime = Math.abs(now.getTime() - lastDaily.getTime());
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

            if (diffHours < 24) {
                const hoursLeft = 24 - diffHours; // Rough estimate
                await interaction.followUp({
                    content: `Sabar bang! Lu baru bisa klaim lagi dalam ${hoursLeft} jam-an. Jangan maruk.`,
                    ephemeral: true
                });
                return;
            }
        }

        try {
            await addWallet(userId, DAILY_AMOUNT);
            await db.user.update({
                where: { id: userId },
                data: { lastDaily: now }
            });

            await interaction.followUp(`Mantap! Lu dapet **${DAILY_AMOUNT}** coins hari ini. Balik lagi besok ya!`);
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Waduh error pas ngasih duit. Coba lagi nanti.", ephemeral: true });
        }
    },
} as Command;
