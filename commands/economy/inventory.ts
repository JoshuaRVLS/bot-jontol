import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import { getInventory, getCSGOSkins } from "../../utils/Database";
import { getItem } from "../../utils/gameItems";
import { getPlayerModifiers } from "../../utils/economyHelper";

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
            const skins = await getCSGOSkins(userId);
            const mods = await getPlayerModifiers(userId);
            const itemIds = Object.keys(inv);

            if (itemIds.length === 0 && skins.length === 0) {
                return interaction.followUp("Tas lu kosong melompong. Beli di /shop atau gacha di /sc gih.");
            }

            const embed = new EmbedBuilder()
                .setTitle(`Tas Belanja ${interaction.user.username}`)
                .setColor(0x8A2BE2)
                .setThumbnail(interaction.user.displayAvatarURL());

            let itemDesc = "### Barang Milik Lu\n";
            if (itemIds.length > 0) {
                itemIds.forEach(id => {
                    const item = getItem(id);
                    const count = inv[id];
                    if (item) {
                        itemDesc += `**${item.name}** x${count}\n> *${item.skill || "No skill"}*\n`;
                    } else {
                        itemDesc += `Unknown Item (${id}) x${count}\n`;
                    }
                });
            } else {
                itemDesc += "*Punya barang tapi gak ada item standar.*\n";
            }

            // ADD CS:GO SKINS
            if (skins.length > 0) {
                itemDesc += "\n### Koleksi Skin CS:GO\n";
                skins.forEach((s: any) => {
                    itemDesc += `**${s.name}**\n> Wear: ${s.wear || "N/A"}\n> Harga: ${s.marketPrice ? `Rp ${s.marketPrice.toLocaleString()}` : "N/A"}\n`;
                });
            }

            embed.setDescription(itemDesc);

            // Add Skill Summary
            let skillSummary = "";
            if (mods.workBonus) skillSummary += `Work Bonus: +${Math.round(mods.workBonus * 100)}%\n`;
            if (mods.crimeSuccess) skillSummary += `Crime Success: +${Math.round(mods.crimeSuccess * 100)}%\n`;
            if (mods.robSuccess) skillSummary += `Rob Success: +${Math.round(mods.robSuccess * 100)}%\n`;
            if (mods.robProtection) skillSummary += `Defense: +${Math.round(mods.robProtection * 100)}%\n`;
            if (mods.cooldownReduction) skillSummary += `Cooldown Reduction: -${Math.round(mods.cooldownReduction * 100)}%\n`;
            if (mods.dailyBonus) skillSummary += `Daily Bonus: +${Math.round(mods.dailyBonus * 100)}%\n`;

            if (skillSummary) {
                embed.addFields({ name: "Total Stat Modifiers", value: skillSummary });
            }

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal buka tas.", ephemeral: true });
        }
    },
} as Command;
