import { Events, Interaction, InteractionResponse } from "discord.js";
import { ButtonEvent, ClientEvent } from "../../@types/type";

export default {
  type: "button",
  authorOnly: true,
  id: "deposit_button",
  execute: async (interaction: Interaction) => {
    if (!interaction.isButton()) return;
    const confirmation = await interaction.message.awaitMessageComponent({
      filter: (i) => i.user === interaction.user,
    });
    await confirmation.reply("Hello!");
  },
} as ButtonEvent;
