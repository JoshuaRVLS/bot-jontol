import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Mute member (Timeout) biar gak berisik")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User yang mau di-timeout")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("duration")
                .setDescription("Durasi dalam MENIT (Ketik angka)")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Alasan timeout"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("user", true);
        const durationMinutes = interaction.options.getInteger("duration", true);
        const reason = interaction.options.getString("reason") || "Berisik/Spam";

        if (targetUser.id === interaction.user.id) return interaction.reply({ content: "Lu mau timeout diri sendiri?", ephemeral: true });
        if (targetUser.id === interaction.client.user.id) return interaction.reply({ content: "Gak bisa timeout bot.", ephemeral: true });

        await interaction.deferReply();

        try {
            const member = await interaction.guild?.members.fetch(targetUser.id);
            if (!member) return interaction.followUp("Member gak ketemu.");

            if (!member.moderatable) {
                return interaction.followUp({ content: "Gak bisa timeout dia. Pangkatnya tinggi.", ephemeral: true });
            }

            const durationMs = durationMinutes * 60 * 1000;
            await member.timeout(durationMs, reason);

            const embed = new EmbedBuilder()
                .setTitle("🤐 Timeout Applied")
                .setColor(0xFFFF00) // Yellow
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: "User", value: `${targetUser.tag}`, inline: true },
                    { name: "Duration", value: `${durationMinutes} menit`, inline: true },
                    { name: "Reason", value: reason }
                )
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal timeout.", ephemeral: true });
        }
    },
} as Command;
