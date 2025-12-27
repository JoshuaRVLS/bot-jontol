import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/type";
import { addWarning } from "../../utils/Database";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Kasih peringatan ke member")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User yang mau di-warn")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Alasan"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") || "Melanggar aturan.";

        if (targetUser.id === interaction.user.id) return interaction.reply({ content: "Jangan warn diri sendiri.", ephemeral: true });
        if (targetUser.bot) return interaction.reply({ content: "Gak guna warn bot.", ephemeral: true });

        await interaction.deferReply();

        try {
            await addWarning(targetUser.id, interaction.user.id, reason);

            // Send DM
            try {
                await targetUser.send(`Lu dapet PERINGATAN (WARN) di **${interaction.guild?.name}**.\nAlasan: ${reason}`);
            } catch (e) {
                // Ignore
            }

            const embed = new EmbedBuilder()
                .setTitle("⚠️ Warning Issued")
                .setColor(0xFFA500) // Orange
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: "User", value: `${targetUser.tag}`, inline: true },
                    { name: "Moderator", value: interaction.user.tag, inline: true },
                    { name: "Reason", value: reason }
                )
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal ngasih warn. Database error.", ephemeral: true });
        }
    },
} as Command;
