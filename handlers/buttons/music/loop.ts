import { ButtonInteraction, GuildMember, MessageFlags } from "discord.js";
import { getDistube } from "../../../utils/player";
import { RepeatMode } from "distube";

export default {
    customId: "music_loop",
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

        const currentMode = queue.repeatMode;
        let newMode: RepeatMode;
        let modeText: string;

        if (currentMode === RepeatMode.DISABLED) {
            newMode = RepeatMode.SONG;
            modeText = "🔂 Loop: Song";
        } else if (currentMode === RepeatMode.SONG) {
            newMode = RepeatMode.QUEUE;
            modeText = "🔁 Loop: Queue";
        } else {
            newMode = RepeatMode.DISABLED;
            modeText = "➡️ Loop: Off";
        }

        distube.setRepeatMode(interaction.guildId!, newMode);
        await interaction.reply({ content: modeText, flags: MessageFlags.Ephemeral });
    }
};
