import { Client, Events, Interaction } from "discord.js";
import { ClientEvent } from "../../types/type";
import ExtendedClient from "../../ExtendedClient/ExtendedClient";

export default {
  once: false,
  type: "event",
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction, client: ExtendedClient) => {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
          console.error(`No command matching ${interaction.commandName} was found.`);
          return;
        }
        await command.execute(interaction);
      } else if (interaction.isButton()) {
        const buttonEvent = client.buttonEvents.get(interaction.customId);
        if (buttonEvent) {
          // Jalanin event button kalo ada
          await buttonEvent.execute(interaction);
        }
      } else if (interaction.isModalSubmit()) {
        const modalEvent = client.modalEvents.get(interaction.customId);
        if (modalEvent) {
          await modalEvent.execute(interaction);
        }
      }
    } catch (error) {
      console.error(`Error executing interaction:`, error);
      if (interaction.isRepliable()) {
        const content = "There was an error while executing this command!";
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content, ephemeral: true });
        } else {
          await interaction.reply({ content, ephemeral: true });
        }
      }
    }
  },
} as ClientEvent;
