import { Client, Events, Interaction } from "discord.js";
import { ClientEvent } from "../../@types/type";
import ExtendedClient from "../../ExtendedClient/ExtendedClient";

export default {
  once: false,
  type: "event",
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction, client: ExtendedClient) => {
    if (interaction.isChatInputCommand()) {
      await client.commands.get(interaction.commandName)?.execute(interaction);
    } else if (interaction.isButton()) {
      if (client.buttonEvents.get(interaction.customId)?.authorOnly) {
        await client.buttonEvents
          .get(interaction.customId)
          ?.execute(interaction);
      }
    }
  },
} as ClientEvent;
