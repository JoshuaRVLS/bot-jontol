import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Interaction } from "discord.js";
import { ButtonEvent } from "../../types/type";

export default {
    type: "button",
    authorOnly: true,
    id: "withdraw_button",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        // Create Modal
        const modal = new ModalBuilder()
            .setCustomId("withdraw_modal")
            .setTitle("Tarik Duit dari Bank");

        const amountInput = new TextInputBuilder()
            .setCustomId("withdraw_amount")
            .setLabel("Mau tarik berapa?")
            .setPlaceholder("Masukin angka atau ketik 'all'")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(amountInput);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    },
} as ButtonEvent;
