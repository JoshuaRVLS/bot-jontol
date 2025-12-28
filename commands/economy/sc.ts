import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../types/type";
import { getUserData, addCSGOSkins, removeWallet, addCSGOSkin } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { getSkinPrice, getWeightedSkin, getSkinFloat } from "../../utils/csgoHelper";

const GACHA_COST = 100000;
const API_URL = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json";

// Cache for skins to avoid fetching every time
let skinsCache: any[] | null = null;

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("sc")
        .setDescription("Gacha skin CS:GO mewah (Biaya: 100k)")
        .addSubcommand(sub =>
            sub.setName("all")
                .setDescription("Gacha pake SEMUA duit yang ada di wallet lu (ALL-IN!)")
        )
        .addSubcommand(sub =>
            sub.setName("allin")
                .setDescription("Habisin seluruh uang di wallet buat gacha!")
        )
        .addSubcommand(sub =>
            sub.setName("amount")
                .setDescription("Gacha berapa kali bang")
                .addIntegerOption(opt =>
                    opt.setName("jumlah")
                        .setDescription("Jumlah gacha (Max 100)")
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true)
                )
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();
        const user = await getUserData(userId);

        if (subcommand === "once") {
            if (user.wallet < GACHA_COST) {
                return interaction.reply({
                    content: `Duit lu gak cukup bang! Gacha ini butuh **${formatRupiah(GACHA_COST)}** di wallet.`,
                    ephemeral: true
                });
            }

            await interaction.deferReply();

            try {
                if (!skinsCache) {
                    const response = await fetch(API_URL);
                    skinsCache = await response.json();
                }

                await removeWallet(userId, GACHA_COST);
                const skin = getWeightedSkin(skinsCache!);
                const { float, wear } = getSkinFloat();
                const marketPrice = getSkinPrice(skin.rarity?.name || "Consumer Grade", float);

                await addCSGOSkin(userId, { ...skin, marketPrice, float, wear });

                const embed = new EmbedBuilder()
                    .setTitle(`🎰 Gacha Berhasil!`)
                    .setDescription(`Sikat bang! Lu baru aja dapet skin cakep.`)
                    .setColor(skin.rarity?.color || 0x00A2FF)
                    .setThumbnail(skin.crates?.[0]?.image || null)
                    .setImage(skin.image)
                    .addFields(
                        { name: "🔫 Weapon", value: skin.weapon?.name || "Unknown", inline: true },
                        { name: "✨ Pattern", value: skin.pattern?.name || "Unknown", inline: true },
                        { name: "🛡️ Rarity", value: skin.rarity?.name || "Unknown", inline: true },
                        { name: "💎 Wear", value: `${wear} (${float})`, inline: true },
                        { name: "🏷️ Est. Price", value: formatRupiah(marketPrice), inline: true },
                        { name: "💰 Biaya Gacha", value: formatRupiah(GACHA_COST), inline: true }
                    )
                    .setFooter({ text: `ID Skin: ${skin.id}` })
                    .setTimestamp();

                return interaction.editReply({
                    content: `### 🎊 CONGRATS ${interaction.user}!`,
                    embeds: [embed]
                });
            } catch (error) {
                console.error(error);
                return interaction.editReply("Gagal gacha bang.");
            }
        }

        if (subcommand === "all" || subcommand === "allin" || subcommand === "amount") {
            let executionCount = 0;
            if (subcommand === "all" || subcommand === "allin") {
                const count = Math.floor(user.wallet / GACHA_COST);
                if (count <= 0) {
                    return interaction.reply({
                        content: `Duit lu gak cukup buat gacha sekali-kali pun bang!`,
                        ephemeral: true
                    });
                }
                executionCount = Math.min(count, 100);
            } else {
                executionCount = interaction.options.getInteger("jumlah", true);
            }

            const totalCost = executionCount * GACHA_COST;

            if (user.wallet < totalCost) {
                return interaction.reply({
                    content: `Duit lu gak cukup buat gacha **${executionCount}x** bang! Butuh **${formatRupiah(totalCost)}**.`,
                    ephemeral: true
                });
            }

            await interaction.deferReply();

            try {
                if (!skinsCache) {
                    const response = await fetch(API_URL);
                    skinsCache = await response.json();
                }

                await removeWallet(userId, totalCost);

                const skinsToDraw = [];
                const summary: Record<string, { count: number; rarityColor: number }> = {};
                let bestSkin = null;

                for (let i = 0; i < executionCount; i++) {
                    const skin = getWeightedSkin(skinsCache!);
                    const { float, wear } = getSkinFloat();
                    const marketPrice = getSkinPrice(skin.rarity?.name || "Consumer Grade", float);
                    const skinData = { ...skin, marketPrice, float, wear };

                    skinsToDraw.push(skinData);

                    const fullName = `${skin.weapon?.name} | ${skin.pattern?.name}`;
                    if (!summary[fullName]) {
                        summary[fullName] = { count: 0, rarityColor: skin.rarity?.color || 0x00A2FF };
                    }
                    summary[fullName].count++;

                    if (!bestSkin || marketPrice > bestSkin.marketPrice) {
                        bestSkin = skinData;
                    }
                }

                await addCSGOSkins(userId, skinsToDraw);

                const summaryDesc = Object.entries(summary)
                    .map(([name, data]) => `• ${name}${data.count > 1 ? ` **(${data.count}x)**` : ""}`)
                    .join("\n");

                const totalEstValue = skinsToDraw.reduce((acc, s) => acc + (s.marketPrice || 0), 0);

                const title = (subcommand === "all" || subcommand === "allin") ? `🎰 ALL-IN GACHA! (${executionCount}x)` : `🎰 MASS GACHA! (${executionCount}x)`;
                const desc = (subcommand === "all" || subcommand === "allin")
                    ? `Gila bang! Lu baru aja nge-gacha massal pake total **${formatRupiah(totalCost)}**!`
                    : `Sikat bang! Lu nge-gacha **${executionCount}x** pake total **${formatRupiah(totalCost)}**!`;

                const allEmbed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(desc)
                    .addFields(
                        { name: "📊 Hasil Gacha", value: summaryDesc.length > 1024 ? summaryDesc.substring(0, 1021) + "..." : summaryDesc, inline: false },
                        { name: "🏷️ Total Est. Value", value: formatRupiah(totalEstValue), inline: true },
                        { name: "💰 Sisa Wallet", value: formatRupiah(user.wallet - totalCost), inline: true }
                    )
                    .setColor(bestSkin?.rarity?.color || 0xFF0000)
                    .setImage(bestSkin?.image || null)
                    .setFooter({ text: `Total Skin unik: ${Object.keys(summary).length} | Best drop: ${bestSkin?.weapon?.name} | ${bestSkin?.pattern?.name}` })
                    .setTimestamp();

                return interaction.editReply({
                    content: `### 🚀 GACHA BERHASIL ${interaction.user}!`,
                    embeds: [allEmbed]
                });
            } catch (error) {
                console.error(error);
                return interaction.editReply("Gagal gacha massal bang.");
            }
        }
    },
} as Command;
