import { SlashCommandBuilder, GuildMember, MessageFlags } from "discord.js";
import { Command } from "../../types/type";
import { getDistube } from "../../utils/player";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the music and clear the queue"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            return interaction.reply({ content: "Lu harus masuk voice channel dulu!", flags: MessageFlags.Ephemeral });
        }

        const distube = getDistube(interaction.client);
        const queue = distube.getQueue(interaction.guildId!);

        if (!queue) {
            return interaction.reply({ content: "Gaada lagu yang lagi diputer.", flags: MessageFlags.Ephemeral });
        }

        await distube.stop(interaction.guildId!);
        await interaction.reply({ content: "⏹️ Musik dihentikan dan queue dibersihkan." });
    },
} as Command;
