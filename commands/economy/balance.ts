import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../../@types/type";
import db, { addNewUser, getUserData, isUserExists } from "../../utils/db";

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
        .setLabel("Deposit")
        .setStyle(ButtonStyle.Primary);
      const actions = new ActionRowBuilder<ButtonBuilder>().addComponents(
        depositButton
      );
      const embed = new EmbedBuilder()
        .setColor(0x00ae86)
        .setTitle("💰 Economy Dashboard")
        .setThumbnail(interaction.user.displayAvatarURL())
        .setDescription(`**${interaction.user.username}'s Financial Overview**`)
        .addFields(
          {
            name: "👛 Wallet Balance",
            value: `**${userData?.wallet || 0} coins**`,
            inline: true,
          },
          {
            name: "🏦 Bank Balance",
            value: `**${userData?.bank || 0} coins**`,
            inline: true,
          }
        )

        .setFooter({
          text: "Use the buttons below to manage your money",
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();
      await interaction.followUp({
        embeds: [embed],
        components: [actions],
      });
    } catch (error) {
      console.log(error);
    }
  },
} as Command;
