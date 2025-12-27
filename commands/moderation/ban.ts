import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban member dari server (Permanen)")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Member yang mau di-ban")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Alasan ban"))
        .addBooleanOption(option =>
            option.setName("delete_messages")
                .setDescription("Hapus chat dia 7 hari terakhir?"))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") || "Tanpa alasan.";
        const deleteMsgs = interaction.options.getBoolean("delete_messages") || false;

        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ content: "Jangan ban diri sendiri woy. Depresi lu?", ephemeral: true });
        }
        if (targetUser.id === interaction.client.user.id) {
            return interaction.reply({ content: "Gw gak bisa di-ban.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const member = await interaction.guild?.members.fetch(targetUser.id).catch(() => null);

            if (member && !member.bannable) {
                return interaction.followUp({ content: "Gagal ban. Pangkat dia terlalu sakti.", ephemeral: true });
            }

            // Send DM
            try {
                await targetUser.send(`Lu kena BANNED dari **${interaction.guild?.name}**.\nAlasan: ${reason}`);
            } catch (e) {
                // Ignore
            }

            await interaction.guild?.members.ban(targetUser.id, {
                reason: reason,
                deleteMessageSeconds: deleteMsgs ? 7 * 24 * 60 * 60 : 0
            });

            const embed = new EmbedBuilder()
                .setTitle("⛔ BAN HAMMER")
                .setColor(0xFF0000) // Red
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: "User", value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                    { name: "Moderator", value: interaction.user.tag, inline: true },
                    { name: "Reason", value: reason },
                    { name: "Delete Msgs", value: deleteMsgs ? "Yes (7 days)" : "No", inline: true }
                )
                .setFooter({ text: "Bot Jontol Justice System" })
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Ada error pas nga-ban.", ephemeral: true });
        }
    },
} as Command;
