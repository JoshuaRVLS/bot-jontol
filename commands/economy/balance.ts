
import {
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../../types/type";
import {
  getUserData,
} from "../../utils/Database";
import { createBalanceEmbed, createBalanceButtons } from "../../utils/uiFactory";

export default {
  type: "command",
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Liat isi dompet lu bang"),
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply();

    try {
      const userData = await getUserData(interaction.user.id);

      const embed = createBalanceEmbed(interaction.user, userData);
      const actions = createBalanceButtons();

      await interaction.followUp({
        embeds: [embed],
        components: [actions],
      });
    } catch (error) {
      console.error("[Balance Command Error]", error);
      await interaction.followUp({
        content: "Gagal ngambil data akun lu. Mungkin database lagi ngambek. Coba lapor admin.",
        ephemeral: true
      });
    }
  },
} as Command;
