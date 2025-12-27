import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Liat foto profil user")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("User yang mau diliat")
                .setRequired(false)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const user = interaction.options.getUser("target") || interaction.user;
        const avatarUrl = user.displayAvatarURL({ size: 1024 });

        const embed = new EmbedBuilder()
            .setTitle(`Avatar ${user.username}`)
            .setImage(avatarUrl)
            .setColor("Random")
            .setFooter({ text: `Requested by ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
