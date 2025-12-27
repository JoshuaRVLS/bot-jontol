import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/type";
import { clearWarnings } from "../../utils/Database";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("clearwarn")
        .setDescription("Hapus semua warning member (Pemutihan)")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User yang mau dihapus warning-nya")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Admin only
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("user", true);

        await interaction.deferReply();

        try {
            await clearWarnings(targetUser.id);

            const embed = new EmbedBuilder()
                .setTitle("✨ Warnings Cleared")
                .setColor(0x00FF00) // Green
                .setDescription(`Semua warning untuk **${targetUser.tag}** berhasil dihapus.`)
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal hapus warning.", ephemeral: true });
        }
    },
} as Command;
