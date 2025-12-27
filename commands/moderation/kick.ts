import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick member yang nakal")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Member yang mau di-kick")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Alasan kick"))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") || "Gak dikasih tau alasannya.";

        // Prevent kicking self or bot
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ content: "Lu mau kick diri sendiri? Kocak geming.", ephemeral: true });
        }
        if (targetUser.id === interaction.client.user.id) {
            return interaction.reply({ content: "Mau nge-kick gw? Langkahi dulu mayat developer gw.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const member = await interaction.guild?.members.fetch(targetUser.id);
            if (!member) {
                return interaction.followUp("Member gak ketemu di server ini.");
            }

            if (!member.kickable) {
                return interaction.followUp({ content: "Gw gak bisa kick dia. Pangkatnya lebih tinggi atau setara gw (atau admin).", ephemeral: true });
            }

            // Send DM to user (optional)
            try {
                await targetUser.send(`Lu di-kick dari **${interaction.guild?.name}**.\nAlasan: ${reason}`);
            } catch (e) {
                // Ignore if DMs closed
            }

            await member.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle("👢 Kick Hammer Has Spoken")
                .setColor(0xFF4500) // Orange Red
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: "User", value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                    { name: "Moderator", value: interaction.user.tag, inline: true },
                    { name: "Reason", value: reason }
                )
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal nge-kick. Ada error misterius.", ephemeral: true });
        }
    },
} as Command;
