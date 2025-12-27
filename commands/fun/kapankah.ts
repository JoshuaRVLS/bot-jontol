import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("kapankah")
        .setDescription("Ramal kapan sesuatu bakal terjadi")
        .addStringOption(option =>
            option.setName("question")
                .setDescription("Kapankah ... ?")
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const question = interaction.options.getString("question", true);

        const answers = [
            "Besok.",
            "Lusa.",
            "Tahun depan.",
            "100 tahun lagi.",
            "Gak bakal sih.",
            "Bentar lagi.",
            "Pas lebaran kuda.",
            "Kapan-kapan.",
            "Sekarang juga!",
            "Minggu depan.",
            "Kalau lu rajin ibadah.",
            "Tunggu aja."
        ];

        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

        await interaction.reply(`🔮 **Pertanyaan:** Kapankah ${question}\n🕰️ **Jawabannya:** ${randomAnswer}`);
    },
} as Command;
