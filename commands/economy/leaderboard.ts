
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import prisma from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Liat siapa yang paling sultan atau paling sepuh")
        .addStringOption(option =>
            option.setName("type")
                .setDescription("Tipe leaderboard")
                .setRequired(true)
                .addChoices(
                    { name: "Sultan (Kekayaan)", value: "money" },
                    { name: "Sepuh (Level)", value: "level" }
                )),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const type = interaction.options.getString("type", true);

        await interaction.deferReply();

        try {
            let users;
            let title = "";
            let description = "";

            if (type === "money") {
                // Top 10 Richest (Bank + Wallet)
                // Note: Prisma can't easily sort by sum of fields in simplified query.
                // We'll fetch top by Bank for now or fetch all and sort (expensive if many users).
                // Let's sort by Bank as primary indicator of wealth.

                users = await prisma.user.findMany({
                    orderBy: { bank: 'desc' },
                    take: 10
                });
                title = "🏆 Top 10 Sultan Server";
            } else {
                // Top 10 Highest Level
                // Sort array to be sure if using complex sort? No, Prisma dict syntax:
                // orderBy: [{ level: 'desc' }, { xp: 'desc' }] works.
                // Re-query for explicit sort
                users = await prisma.user.findMany({
                    orderBy: [
                        { level: 'desc' },
                        { xp: 'desc' }
                    ],
                    take: 10
                });
                title = "🔰 Top 10 Sepuh Server";
            }

            if (users.length === 0) {
                return interaction.followUp("Belum ada data.");
            }

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setColor(0xFFD700) // Gold
                .setThumbnail(interaction.guild?.iconURL() || null);

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const member = await interaction.guild?.members.fetch(user.id).catch(() => null);
                const username = member ? member.user.username : `User - ${user.id.slice(0, 5)} `;

                let medal = "";
                if (i === 0) medal = "🥇";
                else if (i === 1) medal = "🥈";
                else if (i === 2) medal = "🥉";
                else medal = `#${i + 1} `;

                description += `** ${medal} ${username}**\n`;

                if (type === "money") {
                    const totalWealth = user.wallet + user.bank;
                    description += `💰 Total: ** ${formatRupiah(totalWealth)}** (Bank: ${formatRupiah(user.bank)}) \n\n`;
                } else {
                    description += `🔰 Level: ** ${user.level}** (XP: ${user.xp}) \n\n`;
                }
            }

            embed.setDescription(description);

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal ngambil data leaderboard.", ephemeral: true });
        }
    },
} as Command;
