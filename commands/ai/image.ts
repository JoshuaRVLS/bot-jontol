import {
  AttachmentBuilder,
  CacheType,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../@types/type";
import ai from "../../utils/ai";

export default {
  type: "command",
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Imagine any image")
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Tuliskan apa saja yang ada di otak kau bodoh")
        .setRequired(true)
    ),
  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    await interaction.deferReply();

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: interaction.options.getString("description", true),
              },
            ],
            modalities: ["image", "text"],
          }),
        }
      );

      if (!response.ok) {
        // Handle API errors
        const errorText = await response.text();
        console.error("API Error:", errorText);
        await interaction.editReply(
          `Sorry, the image generation failed. API returned status: ${response.status}`
        );
        return;
      }
      const result = await response.json();

      const contentParts = result.choices?.[0]?.message?.images;
      const imagePart = contentParts?.find(
        (part: any) => part.type === "image_url"
      );

      if (!imagePart || !imagePart.image_url.url) {
        await interaction.followUp(
          "Sorry, I couldn't find an image in the API response."
        );
        return;
      }

      const base64Data = imagePart.image_url.url.split(",")[1];
      const imageBuffer = Buffer.from(base64Data, "base64");
      const attachment = new AttachmentBuilder(imageBuffer, {
        name: "generated-image.png",
      });

      await interaction.followUp({
        content: `Here is your image for: **"${interaction.options.getString(
          "description",
          true
        )}"**`,
        files: [attachment],
      });
    } catch (error) {
      console.log(error);
    }
  },
} as Command;
