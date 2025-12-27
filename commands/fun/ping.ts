import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Cek koneksi bot (Pong!)"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`🏓 Pong! Latency: **${latency}ms**. Websocket: **${interaction.client.ws.ping}ms**.`);
    },
} as Command;
