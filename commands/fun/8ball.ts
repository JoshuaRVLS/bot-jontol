import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Tanya ajaib kerang ajaib (Magic 8-Ball)")
        .addStringOption(option =>
            option.setName("question")
                .setDescription("Pertanyaan yang bikin penasaran")
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const question = interaction.options.getString("question", true);

        const answers = [
            "Pasti dong!",
            "Kayaknya sih iya.",
            "Tanpa keraguan.",
            "Ya, jelas banget.",
            "Bisa jadi.",
            "Coba tanya lagi nanti.",
            "Mending gak usah tau deh.",
            "Gak mungkin.",
            "Jawabannya nggak.",
            "Sangat meragukan.",
            "Mimpi lu ketinggian bang.",
            "Tentu saja tidak."
        ];

        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

        let color: any = 0x00FF00; // Green
        if (["Gak mungkin.", "Jawabannya nggak.", "Sangat meragukan.", "Tentu saja tidak."].includes(randomAnswer)) {
            color = 0xFF0000; // Red
        } else if (["Coba tanya lagi nanti.", "Mending gak usah tau deh.", "Bisa jadi."].includes(randomAnswer)) {
            color = 0xFFA500; // Orange
        }

        const embed = new EmbedBuilder()
            .setTitle("🎱 Kerang Ajaib")
            .setColor(color)
            .addFields(
                { name: "❓ Pertanyaan", value: question },
                { name: "🎱 Jawaban", value: `**${randomAnswer}**` }
            )
            .setFooter({ text: `Ditanyakan oleh ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed] });
    },
} as Command;
