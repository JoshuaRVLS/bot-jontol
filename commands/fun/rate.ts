import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("rate")
        .setDescription("Rate seberapa % sesuatu/seseorang")
        .addStringOption(option =>
            option.setName("thing")
                .setDescription("Apa yang mau di-rate?")
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const thing = interaction.options.getString("thing", true);

        // Use consistent hash based on user + thing to make it "consistent" per day? 
        // Or just purely random for chaos? Let's go pure random for fun.
        const rating = Math.floor(Math.random() * 101); // 0-100

        let comment = "";
        if (rating === 100) comment = "SEMPURNA! 🔥";
        else if (rating > 90) comment = "Gokil abis!";
        else if (rating > 75) comment = "Mantap jiwa.";
        else if (rating > 50) comment = "B aja sih.";
        else if (rating > 25) comment = "Agak kurang ya.";
        else if (rating > 0) comment = "Ampas bang.";
        else comment = "Nggak ada harapan. 💀";

        await interaction.reply(`🤔 **Rating untuk ${thing}**: **${rating}%**\n${comment}`);
    },
} as Command;
