import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import { Command } from "../../types/type";
import { addItem, getUserData, removeWallet } from "../../utils/Database";
import { ITEMS, getItem } from "../../utils/gameItems";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Beli barang dari shop")
        .addStringOption(option =>
            option.setName("item_id")
                .setDescription("ID barang yang mau dibeli")
                .setRequired(true)
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Jumlah (default 1)")
                .setMinValue(1)) as SlashCommandBuilder,
    autocomplete: async (interaction: AutocompleteInteraction) => {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const choices = ITEMS.filter(item =>
            item.name.toLowerCase().includes(focusedValue) ||
            item.id.toLowerCase().includes(focusedValue)
        );
        await interaction.respond(
            choices.map(choice => ({ name: `${choice.name} (${formatRupiah(choice.price)})`, value: choice.id })).slice(0, 25)
        );
    },
    execute: async (interaction: ChatInputCommandInteraction) => {
        const itemId = interaction.options.getString("item_id", true);
        const amount = interaction.options.getInteger("amount") || 1;
        const userId = interaction.user.id;

        const item = getItem(itemId);
        if (!item) {
            return interaction.reply({ content: "Item tidak ditemukan. Cek /shop.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);
            const totalPrice = item.price * amount;

            if (userData.wallet < totalPrice) {
                return interaction.followUp(`Saldo kurang. Butuh **${formatRupiah(totalPrice)}**.`);
            }

            await removeWallet(userId, totalPrice);
            await addItem(userId, itemId, amount);

            await interaction.followUp(`Berhasil membeli **${amount}x ${item.name}** seharga **${formatRupiah(totalPrice)}**.`);

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal beli barang.", ephemeral: true });
        }
    },
} as Command;
