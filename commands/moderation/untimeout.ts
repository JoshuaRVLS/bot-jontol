import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("Lepas mute (untimeout) member")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User yang mau dilepas timeout-nya")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Alasan"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") || "Sudah dimaafkan.";

        await interaction.deferReply();

        try {
            const member = await interaction.guild?.members.fetch(targetUser.id);
            if (!member) return interaction.followUp("Member gak ketemu.");

            if (!member.isCommunicationDisabled()) {
                return interaction.followUp("Dia gak lagi di-timeout kok.");
            }

            await member.timeout(null, reason);

            const embed = new EmbedBuilder()
                .setTitle("🔊 Timeout Removed")
                .setColor(0x00FF00) // Green
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: "User", value: `${targetUser.tag}`, inline: true },
                    { name: "Reason", value: reason }
                )
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal untimeout.", ephemeral: true });
        }
    },
} as Command;
