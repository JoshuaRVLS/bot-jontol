import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from "discord.js";
import { Command } from "../../types/type";
import prisma from "../../utils/Database";
import { endGiveaway } from "../../utils/giveawayUtils";
import ms from "ms";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Sistem Giveaway")
        .addSubcommand(sub =>
            sub.setName("start")
                .setDescription("Mulai giveaway baru")
                .addStringOption(opt => opt.setName("prize").setDescription("Hadiah giveaway").setRequired(true))
                .addStringOption(opt => opt.setName("duration").setDescription("Durasi (contoh: 1m, 1h, 1d)").setRequired(true))
                .addIntegerOption(opt => opt.setName("winners").setDescription("Jumlah pemenang").setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName("end")
                .setDescription("Akhiri giveaway secara manual")
                .addStringOption(opt => opt.setName("message_id").setDescription("ID Pesan Giveaway").setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName("reroll")
                .setDescription("Pilih ulang pemenang giveaway")
                .addStringOption(opt => opt.setName("message_id").setDescription("ID Pesan Giveaway").setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName("list")
                .setDescription("List active giveaways")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents), // Using ManageEvents as permission requirement
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "start") {
            const prize = interaction.options.getString("prize", true);
            const durationStr = interaction.options.getString("duration", true);
            const winnersCount = interaction.options.getInteger("winners", true);

            const duration = ms(durationStr as any) as unknown as number;
            if (!duration || isNaN(duration)) {
                return interaction.reply({ content: "Format durasi salah. Gunakan contoh: 1m, 1h, 1d.", ephemeral: true });
            }

            const endsAt = new Date(Date.now() + duration);

            const embed = new EmbedBuilder()
                .setTitle("🎉 GIVEAWAY 🎉")
                .setDescription(`Prize: **${prize}**\n\nEnds: <t:${Math.floor(endsAt.getTime() / 1000)}:R>\nHosted by: ${interaction.user}`)
                .setColor(0x00FF00) // Green
                .addFields(
                    { name: "Winners", value: `${winnersCount}`, inline: true },
                    { name: "Participants", value: "0", inline: true }
                )
                .setFooter({ text: "Ends at" })
                .setTimestamp(endsAt);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("giveaway_join")
                        .setLabel("🎉 Join Giveaway")
                        .setStyle(ButtonStyle.Primary)
                );

            const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

            // Save to DB
            try {
                await prisma.giveaway.create({
                    data: {
                        guildId: interaction.guildId!,
                        channelId: interaction.channelId,
                        messageId: message.id,
                        hostId: interaction.user.id,
                        prize: prize,
                        winnersCount: winnersCount,
                        endsAt: endsAt,
                    }
                });
            } catch (error) {
                console.error("Error creating giveaway:", error);
                await interaction.deleteReply();
                await interaction.followUp({ content: "Gagal membuat giveaway di database.", ephemeral: true });
            }

        } else if (subcommand === "end") {
            const messageId = interaction.options.getString("message_id", true);

            const giveaway = await prisma.giveaway.findUnique({ where: { messageId } });
            if (!giveaway) {
                return interaction.reply({ content: "Giveaway tidak ditemukan.", ephemeral: true });
            }
            if (giveaway.ended) {
                return interaction.reply({ content: "Giveaway sudah berakhir.", ephemeral: true });
            }

            await endGiveaway(giveaway.id, interaction.client);
            await interaction.reply({ content: "Giveaway diakhiri.", ephemeral: true });

        } else if (subcommand === "reroll") {
            const messageId = interaction.options.getString("message_id", true);

            const giveaway = await prisma.giveaway.findUnique({ where: { messageId } });
            if (!giveaway) {
                return interaction.reply({ content: "Giveaway tidak ditemukan.", ephemeral: true });
            }
            if (!giveaway.ended) {
                return interaction.reply({ content: "Giveaway belum berakhir. Gunakan `/giveaway end` dulu.", ephemeral: true });
            }

            // Reroll logic - simplistic reroll just picks one new winner per request for now or re-running selection?
            // Usually reroll picks a new winner from participants excluding current winners? 
            // Or just random from all participants again?
            // Let's implement picking ONE new winner.

            if (giveaway.participants.length === 0) {
                return interaction.reply({ content: "Tidak ada partisipan.", ephemeral: true });
            }

            const newWinnerId = giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)];
            await interaction.reply({
                content: `🎉 New Winner for **${giveaway.prize}**: <@${newWinnerId}>!`,
            });

        } else if (subcommand === "list") {
            const giveaways = await prisma.giveaway.findMany({
                where: {
                    guildId: interaction.guildId!,
                    ended: false
                }
            });

            if (giveaways.length === 0) {
                return interaction.reply({ content: "Tidak ada giveaway aktif saat ini.", ephemeral: true });
            }

            const list = giveaways.map(g => `- **${g.prize}** (Ends: <t:${Math.floor(g.endsAt.getTime() / 1000)}:R>) [Link](https://discord.com/channels/${g.guildId}/${g.channelId}/${g.messageId})`).join("\n");

            const embed = new EmbedBuilder()
                .setTitle("Active Giveaways")
                .setDescription(list)
                .setColor(0x0099FF);

            await interaction.reply({ embeds: [embed] });
        }
    },
} as Command;
