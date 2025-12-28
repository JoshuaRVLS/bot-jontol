
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
                    { name: "Sepuh (Level)", value: "level" },
                    { name: "Rajin (Streak)", value: "streak" }
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
                // Fetch all users to calculate networth (Wallet + Bank + Investments + CS Skins)
                const allUsers = await prisma.user.findMany();

                const usersWithNetworth = allUsers.map(u => {
                    const wallet = u.wallet || 0;
                    const bank = u.bank || 0;

                    // Sum investments
                    const investments = (u.investments as Record<string, number>) || {};
                    const totalInvestments = Object.values(investments).reduce((acc, val) => acc + (val || 0), 0);

                    // Sum CS:GO Skins
                    const inv = (u.inventory as any) || {};
                    const skins = Array.isArray(inv.csSkins) ? inv.csSkins : [];
                    const totalSkinsValue = skins.reduce((acc: number, s: any) => acc + (s.marketPrice || 0), 0);

                    const networth = wallet + bank + totalInvestments + totalSkinsValue;

                    return { ...u, networth };
                });

                // Sort by networth
                usersWithNetworth.sort((a, b) => b.networth - a.networth);
                users = usersWithNetworth.slice(0, 10);
                title = "🏆 Top 10 Sultan Server (Networth)";
            } else if (type === "level") {
                users = await prisma.user.findMany({
                    orderBy: [
                        { level: 'desc' },
                        { xp: 'desc' }
                    ],
                    take: 10
                });
                title = "🔰 Top 10 Sepuh Server";
            } else {
                // Top 10 Daily Streak
                users = await prisma.user.findMany({
                    orderBy: { dailyStreak: 'desc' },
                    take: 10
                });
                title = "🔥 Top 10 Streak Terpanjang";
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
                    description += `💰 Networth: **${formatRupiah((user as any).networth)}**\n> *(Wallet+Bank+Invest+Skins)*\n\n`;
                } else if (type === "level") {
                    description += `🔰 Level: **${user.level}** (XP: ${user.xp})\n\n`;
                } else {
                    description += `🔥 Streak: **${user.dailyStreak || 0} hari**\n\n`;
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
