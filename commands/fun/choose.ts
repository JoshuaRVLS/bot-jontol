import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("choose")
        .setDescription("Minta bot pilihin buat lu")
        .addStringOption(option =>
            option.setName("options")
                .setDescription("Pilihan lu (pisahkan pake koma, misal: bakso, mie ayam, geprek)")
                .setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const input = interaction.options.getString("options", true);
        const options = input.split(",").map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (options.length < 2) {
            await interaction.reply({ content: "Minimal kasih 2 pilihan dong bang! Masa milih sendirian.", ephemeral: true });
            return;
        }

        const chosen = options[Math.floor(Math.random() * options.length)];

        await interaction.reply(`🤖 Gw pilih: **${chosen}**`);
    },
} as Command;
