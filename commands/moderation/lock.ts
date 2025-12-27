import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, TextChannel } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Kunci channel biar gak ada yang bisa chat")
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
                SendMessages: false
            });

            const embed = new EmbedBuilder()
                .setTitle("🔒 Channel Locked")
                .setColor(0xFF0000)
                .setDescription("Channel ini telah dikunci. Jangan berisik.")
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal ngunci channel.", ephemeral: true });
        }
    },
} as Command;
