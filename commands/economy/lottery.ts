import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { getPlayerModifiers } from "../../utils/economyHelper";

const TICKET_PRICE = 25000;

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("lottery")
        .setDescription("Beli tiket gacha buat menangin jackpot total puluhan juta!"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const userId = interaction.user.id;
        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);
            if (userData.wallet < TICKET_PRICE) {
                return interaction.editReply(`Duit lu kurang bang! Butuh **${formatRupiah(TICKET_PRICE)}** buat beli satu tiket.`);
            }

            const mods = await getPlayerModifiers(userId);
            const luckBonus = mods.crimeSuccess || 0; // Usage of luck potion/clover affects lottery

            // Roll
            const roll = Math.random();
            const luckRoll = roll - (luckBonus * 0.05); // Improved chance based on items (limited impact)

            let prize = 0;
            let resultType = "lose";

            if (luckRoll < 0.001) { // 0.1% Jackpot
                prize = Math.floor(Math.random() * (50000000 - 10000000 + 1)) + 10000000;
                resultType = "jackpot";
            } else if (luckRoll < 0.01) { // 1% Major
                prize = Math.floor(Math.random() * (5000000 - 1000000 + 1)) + 1000000;
                resultType = "major";
            } else if (luckRoll < 0.11) { // 10% Minor
                prize = Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000;
                resultType = "minor";
            } else if (luckRoll < 0.31) { // 20% Consolation
                prize = Math.floor(Math.random() * (25000 - 5000 + 1)) + 5000;
                resultType = "consolation";
            }

            // Transaction
            await removeWallet(userId, TICKET_PRICE);
            if (prize > 0) {
                await addWallet(userId, prize);
            }

            const embed = new EmbedBuilder()
                .setTitle("🎰 Hasil Lottery Jontol")
                .setTimestamp();

            if (resultType === "jackpot") {
                embed.setColor(0xFFD700) // Gold
                    .setDescription(`🎉 **GOKIL!! JACKPOT ANJING!!** 🎉\n\nLu dapet hadiah utama sebesar **${formatRupiah(prize)}**! Lu sekarang jadi sultan dadakan!`)
                    .setFooter({ text: "Sumpah ini hoki banget parah." });
            } else if (resultType === "major") {
                embed.setColor(0x00FF00) // Green
                    .setDescription(`🔥 **MENANG BESAR!** 🔥\n\nTiket lu tembus hadiah Major! Dapet **${formatRupiah(prize)}**.`)
                    .setFooter({ text: "Lumayan banget buat modal maling." });
            } else if (resultType === "minor") {
                embed.setColor(0x00A2FF) // Blue
                    .setDescription(`✅ **Menang Cuy.**\n\nLumayanlah dapet **${formatRupiah(prize)}**. Masih profit nih.`)
                    .setFooter({ text: "Hoki tipis-tipis." });
            } else if (resultType === "consolation") {
                embed.setColor(0x808080) // Gray
                    .setDescription(`🩹 **Hadiah Hiburan.**\n\nCuma dapet **${formatRupiah(prize)}**. Gak rugi-rugi amat lah ya.`)
                    .setFooter({ text: "Hampir zonk." });
            } else {
                embed.setColor(0xFF0000) // Red
                    .setDescription(`💀 **ZONK TOTAL!**\n\nDuit **${formatRupiah(TICKET_PRICE)}** melayang sia-sia. Coba lagi kalo masih ada nyali.`)
                    .setFooter({ text: "Bandar menang banyak hari ini." });
            }

            if (luckBonus > 0) {
                embed.addFields({ name: "✨ Luck Factor", value: `Item lu bantu nambah hoki sebesar **+${Math.round(luckBonus * 5)}%**!`, inline: true });
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("[Lottery Error]", error);
            await interaction.editReply("Gagal beli tiket. Mesin gacha-nya rusak.");
        }
    },
} as Command;
