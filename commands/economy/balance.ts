import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../../types/type";
import db, {
  addNewUser,
  getUserData,
  isUserExists,
} from "../../utils/Database";

export default {
  type: "command",
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Lihat balance kamu"),
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply();

    try {
      const userData = await getUserData(interaction.user.id);

      const depositButton = new ButtonBuilder()
        .setCustomId("deposit_button")
        .setLabel("Deposit Ke Bank")
        .setStyle(ButtonStyle.Success)
        .setEmoji("🏦");

      const withdrawButton = new ButtonBuilder()
        .setCustomId("withdraw_button")
        .setLabel("Tarik Duit")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("💸");

      const actions = new ActionRowBuilder<ButtonBuilder>().addComponents(
        depositButton,
        withdrawButton
      );

      const embed = new EmbedBuilder()
        .setColor(0xFFA500) // Gold-ish
        .setTitle(`💳 Dompetnya ${interaction.user.username}`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .setDescription("Ini detail kekayaan lu saat ini:")
        .addFields(
          {
            name: "💴 Cash di Tangan",
            value: `**${userData.wallet.toLocaleString()}** coins`,
            inline: true,
          },
          {
            name: "🏦 Tabungan Bank",
            value: `**${userData.bank.toLocaleString()}** coins`,
            inline: true,
          },
          {
            name: "💎 Total Kekayaan",
            value: `**${(userData.wallet + userData.bank).toLocaleString()}** coins`,
            inline: false
          }
        )
        .setFooter({
          text: "Bot Jontol Economy System",
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

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
