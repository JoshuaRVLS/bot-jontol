import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { Command } from "../../types/type";
import { ITEMS } from "../../utils/gameItems";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Liat barang-barang yang dijual di pasar gelap"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setTitle("🛒 Warung Kelontong Jontol")
            .setDescription("Beli barang biar makin GG gaming.")
            .setColor(0x00A2FF);

        ITEMS.forEach(item => {
            embed.addFields({
                name: `${item.emoji} ${item.name} — ${formatRupiah(item.price)}`,
                value: `*${item.description}*\nID: \`${item.id}\``
            });
        });

        embed.setFooter({ text: "Gunakan /buy [id] untuk membeli barang." });

        await interaction.followUp({ embeds: [embed] });
    },
} as Command;
