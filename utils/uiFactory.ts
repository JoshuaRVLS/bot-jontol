import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, User } from "discord.js";
import { formatRupiah } from "./format";

export const createBalanceEmbed = (user: User, userData: { wallet: number, bank: number }) => {
    return new EmbedBuilder()
        .setColor(0xFFA500) // Gold-ish
        .setTitle(`💳 Dompetnya ${user.username}`)
        .setThumbnail(user.displayAvatarURL())
        .setDescription("Ini detail kekayaan lu saat ini:")
        .addFields(
            {
                name: "💴 Cash di Tangan",
                value: `**${formatRupiah(userData.wallet)}**`,
                inline: true,
            },
            {
                name: "🏦 Tabungan Bank",
                value: `**${formatRupiah(userData.bank)}**`,
                inline: true,
            },
            {
                name: "💎 Total Kekayaan",
                value: `**${formatRupiah(userData.wallet + userData.bank)}**`,
                inline: false
            }
        )
        .setFooter({
            text: "Bot Jontol Economy System",
            iconURL: user.displayAvatarURL(),
        })
        .setTimestamp();
};

export const createBalanceButtons = () => {
    const depositButton = new ButtonBuilder()
        .setCustomId("deposit_button")
        .setLabel("Deposit Ke Bank")
        .setStyle(ButtonStyle.Success)
        .setEmoji("🏦");

    const withdrawButton = new ButtonBuilder()
        .setCustomId("withdraw_button")
        .setLabel("Tarik Duit")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("💸");

    return new ActionRowBuilder<ButtonBuilder>().addComponents(depositButton, withdrawButton);
};
