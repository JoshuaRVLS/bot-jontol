import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { Command } from "../../types/type";
import { getSkinPrice, getWeightedSkin, getSkinFloat, CASE_CONFIGS, CaseType } from "../../utils/csgoHelper";
import { getUserData, addCSGOSkins, removeWallet, addCSGOSkin, incrementPity, resetPity, updatePity } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

const API_URL = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json";

// Cache for skins to avoid fetching every time
let skinsCache: any[] | null = null;

const announceRareDrop = async (interaction: ChatInputCommandInteraction, skin: any, caseName: string) => {
    const rarity = skin.rarity?.name?.toLowerCase() || "";
    if (rarity.includes("covert") || rarity.includes("gold") || rarity.includes("extraordinary") || rarity.includes("rare special")) {
        const channel = interaction.channel as TextChannel;
        if (!channel) return;

        const announcement = new EmbedBuilder()
            .setTitle("GLOBAL DROP ALERT")
            .setDescription(`**${interaction.user.username}** mendapatkan drop **${skin.rarity?.name}** dari **${caseName}**`)
            .addFields(
                { name: "Weapon", value: `${skin.weapon?.name} | ${skin.pattern?.name}`, inline: true },
                { name: "Wear", value: `${skin.wear} (${skin.float})`, inline: true },
                { name: "Est. Price", value: formatRupiah(skin.marketPrice), inline: true }
            )
            .setColor(skin.rarity?.color || 0xFFD700)
            .setThumbnail(skin.image)
            .setTimestamp();

        await channel.send({ embeds: [announcement] });
    }
};

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("sc")
        .setDescription("Gacha skin CS:GO mewah")
        .addSubcommand(sub =>
            sub.setName("list")
                .setDescription("Lihat daftar case yang tersedia")
        )
        .addSubcommand(sub =>
            sub.setName("buy")
                .setDescription("Beli case pilihanmu")
                .addStringOption(opt =>
                    opt.setName("case")
                        .setDescription("Pilih jenis case")
                        .setRequired(true)
                        .addChoices(
                            { name: "Kasta Najis (15k)", value: "budget" },
                            { name: "Kasta Rendah (100k)", value: "classic" },
                            { name: "Kasta Menengah Kebawah (1M)", value: "highroller" },
                            { name: "Kasta Tinggi (10M)", value: "elite" },
                            { name: "Kasta Sultan (100M)", value: "sultan" }
                        )
                )
                .addIntegerOption(opt =>
                    opt.setName("jumlah")
                        .setDescription("Jumlah gacha (Max 50)")
                        .setMinValue(1)
                        .setMaxValue(50)
                )
        )
        .addSubcommand(sub =>
            sub.setName("allin")
                .setDescription("Habisin seluruh uang di wallet buat gacha case pilihan!")
                .addStringOption(opt =>
                    opt.setName("case")
                        .setDescription("Pilih jenis case")
                        .setRequired(true)
                        .addChoices(
                            { name: "Kasta Najis (15k)", value: "budget" },
                            { name: "Kasta Rendah (100k)", value: "classic" },
                            { name: "Kasta Menengah Kebawah (1M)", value: "highroller" },
                            { name: "Kasta Tinggi (10M)", value: "elite" },
                            { name: "Kasta Sultan (100M)", value: "sultan" }
                        )
                )
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();
        const user = await getUserData(userId);

        if (subcommand === "list") {
            const embed = new EmbedBuilder()
                .setTitle("Daftar Case CS:GO")
                .setDescription("Pilih case sesuai saldo wallet lu.")
                .setColor(0x00A2FF)
                .setTimestamp();

            Object.entries(CASE_CONFIGS).forEach(([key, config]) => {
                embed.addFields({
                    name: `${config.name} - ${formatRupiah(config.cost)}`,
                    value: config.description,
                    inline: false
                });
            });

            return interaction.reply({ embeds: [embed] });
        }

        const caseId = interaction.options.getString("case", true) as CaseType;
        const config = CASE_CONFIGS[caseId];
        let executionCount = 1;

        if (subcommand === "allin") {
            executionCount = Math.floor(user.wallet / config.cost);
            executionCount = Math.min(executionCount, 50); // Hard limit safety

            if (executionCount <= 0) {
                return interaction.reply({
                    content: `Saldo lu gak cukup buat beli **${config.name}**.`,
                    ephemeral: true
                });
            }
        } else if (subcommand === "buy") {
            executionCount = interaction.options.getInteger("jumlah") || 1;
        }

        const totalCost = executionCount * config.cost;
        if (user.wallet < totalCost) {
            return interaction.reply({
                content: `Saldo lu gak cukup. Gacha **${executionCount}x ${config.name}** butuh **${formatRupiah(totalCost)}**.`,
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
            let bestSkin: any = null;

            let currentPity = user.scPity || 0;
            let pityReset = false;

            for (let i = 0; i < executionCount; i++) {
                const rawSkin = getWeightedSkin(skinsCache!, caseId, currentPity);
                const rarity = rawSkin.rarity?.name?.toLowerCase() || "";

                // Check if rare to reset pity
                if (rarity.includes("covert") || rarity.includes("extraordinary") || rarity.includes("gold") || rarity.includes("rare special")) {
                    pityReset = true;
                    currentPity = 0;
                } else {
                    currentPity++;
                }

                const { float, wear } = getSkinFloat();
                const marketPrice = getSkinPrice(rawSkin.rarity?.name || "Consumer Grade", float);
                const fullName = `${rawSkin.weapon?.name} | ${rawSkin.pattern?.name}`;

                const skinData = {
                    ...rawSkin,
                    name: fullName,
                    marketPrice,
                    float,
                    wear
                };

                skinsToDraw.push(skinData);

                if (!summary[fullName]) {
                    summary[fullName] = { count: 0, rarityColor: rawSkin.rarity?.color || 0x00A2FF };
                }
                summary[fullName].count++;

                if (!bestSkin || marketPrice > bestSkin.marketPrice) {
                    bestSkin = skinData;
                }

                // Announce single rare drops if it's a small gacha or just the best one
                if (executionCount === 1) {
                    await announceRareDrop(interaction, skinData, config.name);
                }
            }

            if (executionCount > 1 && bestSkin) {
                await announceRareDrop(interaction, bestSkin, config.name);
            }

            // Update user's final pity state in DB
            await updatePity(userId, currentPity);

            if (executionCount === 1) {
                const skin = skinsToDraw[0];
                await addCSGOSkin(userId, skin);

                const embed = new EmbedBuilder()
                    .setTitle(`Gacha Berhasil`)
                    .setDescription(`Lu mendapatkan skin dari **${config.name}**.`)
                    .setColor(skin.rarity?.color || 0x00A2FF)
                    .setImage(skin.image)
                    .addFields(
                        { name: "Weapon", value: skin.weapon?.name || "Unknown", inline: true },
                        { name: "Pattern", value: skin.pattern?.name || "Unknown", inline: true },
                        { name: "Rarity", value: skin.rarity?.name || "Unknown", inline: true },
                        { name: "Wear", value: `${skin.wear} (${skin.float})`, inline: true },
                        { name: "Est. Price", value: formatRupiah(skin.marketPrice), inline: true },
                        { name: "Biaya", value: formatRupiah(config.cost), inline: true }
                    )
                    .setTimestamp();

                return interaction.editReply({
                    content: `### Gacha Berhasil ${interaction.user}`,
                    embeds: [embed.setFooter({ text: `Pity Count: ${pityReset ? 0 : currentPity}` })]
                });
            } else {
                await addCSGOSkins(userId, skinsToDraw);

                const summaryDesc = Object.entries(summary)
                    .map(([name, data]) => `• ${name}${data.count > 1 ? ` **(${data.count}x)**` : ""}`)
                    .join("\n");

                const totalEstValue = skinsToDraw.reduce((acc, s) => acc + (s.marketPrice || 0), 0);

                const allEmbed = new EmbedBuilder()
                    .setTitle(`Mass Gacha: ${executionCount}x ${config.name}`)
                    .setDescription(`Lu melakukan gacha massal dengan total biaya **${formatRupiah(totalCost)}**.`)
                    .addFields(
                        { name: "Hasil Gacha", value: summaryDesc.length > 1024 ? summaryDesc.substring(0, 1021) + "..." : summaryDesc, inline: false },
                        { name: "Total Est. Value", value: formatRupiah(totalEstValue), inline: true },
                        { name: "Sisa Wallet", value: formatRupiah(user.wallet - totalCost), inline: true }
                    )
                    .setColor(bestSkin?.rarity?.color || 0xFF0000)
                    .setImage(bestSkin?.image || null)
                    .setFooter({ text: `Best drop: ${bestSkin?.weapon?.name} | ${bestSkin?.pattern?.name}${pityReset ? "" : ` • Pity: ${currentPity}`}` })
                    .setTimestamp();

                return interaction.editReply({
                    content: `### Gacha Berhasil ${interaction.user}`,
                    embeds: [allEmbed]
                });
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply("Gagal gacha bang.");
        }
    },
} as any;
