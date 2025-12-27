import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import { getInventory } from "../../utils/Database";
import { getItem } from "../../utils/gameItems";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("Cek tas lu isinya apaan aja"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        await interaction.deferReply();
        const userId = interaction.user.id;

        try {
            const inv = await getInventory(userId);
            const itemIds = Object.keys(inv);

            if (itemIds.length === 0) {
                return interaction.followUp("Tas lu kosong melompong. Beli di /shop gih.");
            }

            const embed = new EmbedBuilder()
                .setTitle(`🎒 Inventory ${interaction.user.username}`)
                .setColor(0x8A2BE2)
                .setThumbnail(interaction.user.displayAvatarURL());

            let desc = "";
            itemIds.forEach(id => {
                const item = getItem(id);
                const count = inv[id];
                if (item) {
                    desc += `${item.emoji} **${item.name}** x${count}\n`;
                } else {
                    desc += `Unknown Item (${id}) x${count}\n`;
                }
            });

            embed.setDescription(desc || "Kosong.");

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal buka tas.", ephemeral: true });
        }
    },
} as Command;
