import { ButtonInteraction, GuildMember, MessageFlags } from "discord.js";
import { getDistube } from "../../../utils/player";

export default {
    customId: "music_skip",
    execute: async (interaction: ButtonInteraction) => {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            return interaction.reply({ content: "Lu harus di voice channel!", flags: MessageFlags.Ephemeral });
        }

        const distube = getDistube(interaction.client);
        const queue = distube.getQueue(interaction.guildId!);

        if (!queue || queue.songs.length <= 1) {
            return interaction.reply({ content: "Gaada lagu selanjutnya.", flags: MessageFlags.Ephemeral });
        }

        await distube.skip(interaction.guildId!);
        await interaction.reply({ content: "⏭️ Skipped!", flags: MessageFlags.Ephemeral });
    }
};
