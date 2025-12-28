import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, MessageFlags, TextChannel } from "discord.js";
import { Command } from "../../types/type";
import { getDistube } from "../../utils/player";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song from YouTube or other sources")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Song name or URL")
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            return interaction.reply({ content: "Lu harus masuk voice channel dulu kocak!", flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply();

        const distube = getDistube(interaction.client);
        const query = interaction.options.getString("query", true);
        const textChannel = interaction.channel as TextChannel;

        try {
            await distube.play(member.voice.channel, query, {
                member: member,
                textChannel: textChannel,
            });

            const queue = distube.getQueue(interaction.guildId!);
            const song = queue?.songs[0];

            if (!song) {
                return interaction.followUp({ content: "Gagal memutar lagu." });
            }

            const embed = new EmbedBuilder()
                .setTitle("🎶 Now Playing")
                .setDescription(`**[${song.name}](${song.url})**\nBy: ${song.uploader?.name || "Unknown"}`)
                .setThumbnail(song.thumbnail || null)
                .addFields(
                    { name: "Duration", value: song.formattedDuration || "Unknown", inline: true },
                    { name: "Requested by", value: interaction.user.toString(), inline: true }
                )
                .setColor(0xFFA500);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder().setCustomId("music_pause").setEmoji("⏯️").setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId("music_skip").setEmoji("⏭️").setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId("music_stop").setEmoji("⏹️").setStyle(ButtonStyle.Danger),
                    new ButtonBuilder().setCustomId("music_shuffle").setEmoji("🔀").setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId("music_loop").setEmoji("🔁").setStyle(ButtonStyle.Secondary)
                );

            await interaction.followUp({ embeds: [embed], components: [row] });

        } catch (error: any) {
            console.error(error);
            const errorMessage = (error.message || error).toString();
            const safeError = errorMessage.length > 1900 ? errorMessage.substring(0, 1900) + "..." : errorMessage;
            await interaction.followUp({ content: "Ada error pas muter lagu: " + safeError });
        }
    },
} as Command;
