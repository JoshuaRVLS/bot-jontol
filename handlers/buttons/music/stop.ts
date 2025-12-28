import { ButtonEvent } from "../../../types/type";
import { Interaction, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { getDistube } from "../../../utils/player";

export default {
    type: "button",
    authorOnly: false,
    id: "music_stop",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        await interaction.deferUpdate();

        const distube = getDistube(interaction.client);
        const queue = distube.getQueue(interaction.guildId!);

        if (queue) {
            await distube.stop(interaction.guildId!);
        }

        const components = interaction.message.components.map(oldRow => {
            const row = new ActionRowBuilder<ButtonBuilder>();
            oldRow.components.forEach(component => {
                const button = ButtonBuilder.from(component as any);
                button.setDisabled(true);
                row.addComponents(button);
            });
            return row;
        });

        await interaction.editReply({ components: components });
    }
} as ButtonEvent;
