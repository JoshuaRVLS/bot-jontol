import { Events, Interaction, InteractionResponse, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";
import { ButtonEvent, ClientEvent } from "../../types/type";

export default {
  type: "button",
  authorOnly: true,
  id: "deposit_button",
  execute: async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    // Create Modal
    const modal = new ModalBuilder()
      .setCustomId("deposit_modal")
      .setTitle("Deposit ke Bank");

    const amountInput = new TextInputBuilder()
      .setCustomId("deposit_amount")
      .setLabel("Mau deposit berapa?")
      .setPlaceholder("Masukin angka atau ketik 'all'")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(amountInput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  },
} as ButtonEvent;
