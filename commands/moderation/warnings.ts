import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/type";
import { getWarnings } from "../../utils/Database";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Liat daftar warning member")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User yang mau diliat warning-nya")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("user", true);

        await interaction.deferReply();

        try {
            const warnings = await getWarnings(targetUser.id);

            if (warnings.length === 0) {
                return interaction.followUp(`User **${targetUser.tag}** bersih. Gak ada warning.`);
            }

            const embed = new EmbedBuilder()
                .setTitle(`⚠️ Warnings for ${targetUser.username}`)
                .setColor(0xFFA500) // Orange
                .setThumbnail(targetUser.displayAvatarURL())
                .setTimestamp();

            const description = warnings.map((warn, index) => {
                const date = new Date(warn.createdAt).toLocaleDateString("id-ID");
                return `**${index + 1}.** ${warn.reason} - <@${warn.moderatorId}> (${date})`;
            }).join("\n");

            embed.setDescription(description);

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal ngambil data warning.", ephemeral: true });
        }
    },
} as Command;
