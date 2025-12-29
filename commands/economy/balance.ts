import {
  SlashCommandBuilder,
  AttachmentBuilder
} from "discord.js";
import type { Command } from "../../types/type";
import {
  getUserData,
  getTotalInvestmentValue
} from "../../utils/Database";
import { createBalanceButtons } from "../../utils/uiFactory";
import { createBalanceCard } from "../../utils/imageCardHelper";

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
      const totalInvestment = await getTotalInvestmentValue(interaction.user.id);

      // Generate the Card Image
      const cardBuffer = await createBalanceCard(interaction.user, {
        wallet: userData.wallet,
        bank: userData.bank,
        investment: totalInvestment
      });
      const attachment = new AttachmentBuilder(cardBuffer, { name: "balance-card.png" });

      const actions = createBalanceButtons();

      await interaction.followUp({
        files: [attachment],
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
