import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, TextChannel } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Buka kunci channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        await interaction.deferReply();

        const channel = interaction.channel;
        if (!channel || channel.type !== ChannelType.GuildText) {
            return interaction.followUp("Command ini cuma bisa dipakai di Text Channel.");
        }

        const textChannel = channel as TextChannel;

        try {
            await textChannel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
                SendMessages: null
            });

            const embed = new EmbedBuilder()
                .setTitle("🔓 Channel Unlocked")
                .setColor(0x00FF00)
                .setDescription("Silakan chat lagi, tapi jangan spam.")
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal buka kunci channel.", ephemeral: true });
        }
    },
} as Command;
