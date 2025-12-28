import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { Command } from "../../types/type";
import { getUserData, getLevelXp } from "../../utils/Database";
import { createRankCard } from "../../utils/canvasUtils";

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

            const buffer = await createRankCard(targetUser, level, currentXp, requiredXp);
            const attachment = new AttachmentBuilder(buffer, { name: "rank.png" });

            await interaction.followUp({ files: [attachment] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal cek rank.", ephemeral: true });
        }
    },
} as Command;
