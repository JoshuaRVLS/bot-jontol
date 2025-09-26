import {
  CacheType,
  Interaction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../@types/type";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources";
import ai from "../../utils/AI";

export default {
  type: "command",
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Tanya bot ini apa aja")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Tanya apa aja kontol")
        .setRequired(true)
    ),
  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.channel?.id != "1419342201607159839") {
      return await interaction.reply({
        content: `Tolong di chat saya di <#1419342201607159839>`,
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply();

    const completion = await ai.chat.completions.create({
      model: "x-ai/grok-code-fast-1",
      messages: [
        {
          role: "user",
          content: interaction.options.getString("question", true),
        },
      ],
    });
    await interaction.followUp({
      flags: MessageFlags.Ephemeral,
      content: completion.choices[0].message.content as string,
    });
  },
} as Command;
