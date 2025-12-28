import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../types/type";
import { getUserData, addWallet, removeWallet, updateInvestment, getMarketAssets, getMarketAsset, getInvestments } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { updateMarketPrices, getPriceTrend } from "../../utils/marketHelper";
import { generateEconomyResponse } from "../../utils/aiHelper";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("invest")
        .setDescription("Main saham & crypto biar kaya (atau boncos)")
        .addSubcommand(sub =>
            sub.setName("market")
                .setDescription("Cek harga pasar saat ini"))
        .addSubcommand(sub =>
            sub.setName("buy")
                .setDescription("Beli aset investasi pake Rupiah")
                .addStringOption(opt => opt.setName("asset").setDescription("ID Aset (BTC, GOTO, dll)").setRequired(true))
                .addNumberOption(opt => opt.setName("money").setDescription("Jumlah Rupiah yang mau dipake").setRequired(true)))
        .addSubcommand(sub =>
            sub.setName("sell")
                .setDescription("Jual aset investasi (terima Rupiah)")
                .addStringOption(opt => opt.setName("asset").setDescription("ID Aset (BTC, GOTO, dll)").setRequired(true))
                .addNumberOption(opt => opt.setName("money").setDescription("Jumlah Rupiah yang mau dicairkan").setRequired(true)))
        .addSubcommand(sub =>
            sub.setName("portfolio")
                .setDescription("Liat koleksi aset lu")),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();
        const sub = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        // Sync market prices and get potential event message
        const eventMsg = await updateMarketPrices();

        if (sub === "market") {
            const assets = await getMarketAssets();
            const embed = new EmbedBuilder()
                .setTitle("🏛️ Jontol Stock Exchange (JSX)")
                .setColor(eventMsg ? 0xFF0000 : 0x00FF00)
                .setTimestamp();

            let desc = eventMsg ? `${eventMsg}\n\n` : "";
            desc += "Investasi beresiko tinggi. Do Your Own Research (DYOR).\n\n";
            assets.forEach(asset => {
                const trend = getPriceTrend(asset.price, asset.lastPrice);
                desc += `**${asset.id}** (${asset.name})\n> Harga: \`${formatRupiah(asset.price)}\`\n> Trend: ${trend}\n\n`;
            });
            embed.setDescription(desc);
            return interaction.editReply({ embeds: [embed] });
        }

        if (sub === "buy") {
            const assetId = interaction.options.getString("asset", true).toUpperCase();
            const money = interaction.options.getNumber("money", true);
            const asset = await getMarketAsset(assetId);

            if (!asset) return interaction.editReply("Aset itu gak ada di list JSX bang.");
            if (money < 1000) return interaction.editReply("Minimal investasi Rp1.000 lah bang.");

            const userData = await getUserData(userId);
            if (userData.wallet < money) {
                return interaction.editReply(`Duit lu gak cukup! Saldo lu cuma **${formatRupiah(userData.wallet)}**.`);
            }

            const amount = money / asset.price;

            await removeWallet(userId, money);
            await updateInvestment(userId, assetId, amount);

            const aiMsg = await generateEconomyResponse("invest-buy", `Bought ${amount.toFixed(8)} of ${assetId} for ${formatRupiah(money)}. High risk!`);
            return interaction.editReply(aiMsg || `Berhasil beli **${amount.toFixed(8)} ${assetId}** seharga **${formatRupiah(money)}**!`);
        }

        if (sub === "sell") {
            const assetId = interaction.options.getString("asset", true).toUpperCase();
            const money = interaction.options.getNumber("money", true);
            const asset = await getMarketAsset(assetId);
            const userInvests = await getInvestments(userId);

            if (!asset) return interaction.editReply("Aset itu gak ada di list JSX.");
            if (money <= 0) return interaction.editReply("Mau cairin berapa bang? Masukin jumlah duitnya.");

            const amountNeeded = money / asset.price;
            const currentHolding = userInvests[assetId] || 0;

            if (currentHolding < amountNeeded) {
                const maxMoney = currentHolding * asset.price;
                return interaction.editReply(`Aset \`${assetId}\` lu gak cukup buat dicairin segitu! Maksimal cuma bisa cairin **${formatRupiah(maxMoney)}** (${currentHolding.toFixed(8)} unit).`);
            }

            await updateInvestment(userId, assetId, -amountNeeded);
            await addWallet(userId, money);

            const aiMsg = await generateEconomyResponse("invest-sell", `Sold ${amountNeeded.toFixed(8)} of ${assetId} for ${formatRupiah(money)}. Hope it was profit.`);
            return interaction.editReply(aiMsg || `Berhasil jual **${amountNeeded.toFixed(8)} ${assetId}** dan dapet tunai **${formatRupiah(money)}**!`);
        }

        if (sub === "portfolio") {
            const userInvests = await getInvestments(userId);
            const assetDetails = await getMarketAssets();
            const embed = new EmbedBuilder()
                .setTitle(`💼 Portofolio ${interaction.user.username}`)
                .setColor(0x8A2BE2)
                .setTimestamp();

            let totalValue = 0;
            let desc = "";

            for (const [id, amount] of Object.entries(userInvests)) {
                const asset = assetDetails.find(a => a.id === id);
                if (asset) {
                    const value = asset.price * amount;
                    totalValue += value;
                    desc += `**${id}**: ${amount} unit\n> Value: \`${formatRupiah(value)}\`\n`;
                }
            }

            if (!desc) desc = "Lu belum punya investasi apa-apa. Cupu.";

            embed.setDescription(desc);
            embed.addFields({ name: "💰 Total Estimasi Saldo", value: formatRupiah(totalValue) });

            return interaction.editReply({ embeds: [embed] });
        }
    },
} as Command;
