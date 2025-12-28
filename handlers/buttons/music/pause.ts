import { ButtonInteraction, GuildMember, MessageFlags } from "discord.js";
import { getDistube } from "../../../utils/player";

export default {
    customId: "music_pause",
    execute: async (interaction: ButtonInteraction) => {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            return interaction.reply({ content: "Lu harus di voice channel!", flags: MessageFlags.Ephemeral });
        }

        const distube = getDistube(interaction.client);
        const queue = distube.getQueue(interaction.guildId!);

        if (!queue) {
            return interaction.reply({ content: "Gaada lagu yang lagi diputer.", flags: MessageFlags.Ephemeral });
        }

        if (queue.paused) {
            distube.resume(interaction.guildId!);
            await interaction.reply({ content: "▶️ Resumed!", flags: MessageFlags.Ephemeral });
        } else {
            distube.pause(interaction.guildId!);
            await interaction.reply({ content: "⏸️ Paused!", flags: MessageFlags.Ephemeral });
        }
    }
};
