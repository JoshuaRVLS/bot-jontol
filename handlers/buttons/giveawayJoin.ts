import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction } from "discord.js";
import { ButtonEvent } from "../../types/type";
import prisma from "../../utils/Database";

export default {
    type: "button",
    authorOnly: false,
    id: "giveaway_join",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        await interaction.deferReply({ ephemeral: true });

        const messageId = interaction.message.id;
        const userId = interaction.user.id;

        // Fetch giveaway
        const giveaway = await prisma.giveaway.findUnique({
            where: { messageId: messageId }
        });

        if (!giveaway) {
            return interaction.followUp({ content: "Giveaway tidak ditemukan atau sudah dihapus." });
        }

        if (giveaway.ended) {
            return interaction.followUp({ content: "Giveaway sudah berakhir." });
        }

        if (giveaway.participants.includes(userId)) {
            // Optional: Leave giveaway? For now just say already joined.
            return interaction.followUp({ content: "Lu udah join giveaway ini." });
        }

        // Add user
        const updatedGiveaway = await prisma.giveaway.update({
            where: { id: giveaway.id },
            data: {
                participants: { push: userId }
            }
        });

        // Update Embed
        const embed = EmbedBuilder.from(interaction.message.embeds[0]);
        // Assuming fields[1] is participants count
        const fields = embed.data.fields || [];
        const newFields = fields.map(f => {
            if (f.name === "Participants") {
                return { ...f, value: `${updatedGiveaway.participants.length}` };
            }
            return f;
        });

        embed.setFields(newFields);

        await interaction.message.edit({ embeds: [embed] });

        await interaction.followUp({ content: "✅ Berhasil join giveaway!" });
    }
} as ButtonEvent;
