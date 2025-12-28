import { SlashCommandBuilder, AttachmentBuilder, GuildMember, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../types/type";
import { generateCard } from "../../utils/cardGenerator";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("testcard")
        .setDescription("Test the welcome/leave card generation")
        .addStringOption(option =>
            option.setName("type")
                .setDescription("The type of card to test")
                .setRequired(true)
                .addChoices(
                    { name: "Welcome", value: "welcome" },
                    { name: "Leave", value: "leave" }
                )
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        try {
            const type = interaction.options.getString("type") as "welcome" | "leave";
            const member = interaction.member as GuildMember;

            const buffer = await generateCard(member, type);
            const attachment = new AttachmentBuilder(buffer, { name: `${type}.png` });

            await interaction.editReply({
                content: `Here is a preview of the **${type}** card:`,
                files: [attachment]
            });
        } catch (error) {
            console.error("[Command: testcard] Error:", error);
            await interaction.editReply("Failed to generate test card.");
        }
    },
} as Command;
