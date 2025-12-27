import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { Command } from "../../types/type";
import { getUserData, getLevelXp } from "../../utils/Database";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Cek Level dan XP lu")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User lain (Optional)")),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const targetUser = interaction.options.getUser("user") || interaction.user;
        const userId = targetUser.id;

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);
            const level = userData.level;
            const currentXp = userData.xp;
            const requiredXp = getLevelXp(level);

            // Calc total xp for progress bar (rough) or just current level progress.
            // Simplified: XP resets or accumulates? 
            // My logic: newXp = oldXp + gain. if newXp >= req, newXp -= req.
            // So xp in DB is "Current level XP".

            const percentage = Math.floor((currentXp / requiredXp) * 100);
            const progressBar = createProgressBar(currentXp, requiredXp);

            const embed = new EmbedBuilder()
                .setTitle(`🔰 Rank Card: ${targetUser.username}`)
                .setColor(0x00BFFF) // Deep Sky Blue
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: "Level", value: `**${level}**`, inline: true },
                    { name: "XP", value: `${currentXp} / ${requiredXp}`, inline: true },
                    { name: "Progress", value: `${progressBar} (${percentage}%)`, inline: false }
                )
                .setFooter({ text: "Terus chatting biar naik level!" });

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal cek rank.", ephemeral: true });
        }
    },
} as Command;

function createProgressBar(current: number, total: number, size: number = 10): string {
    const progress = Math.round((current / total) * size);
    const empty = size - progress;
    return "🟩".repeat(progress) + "⬜".repeat(empty);
}
