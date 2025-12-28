import { ModalSubmitInteraction, EmbedBuilder } from "discord.js";
import { ModalEvent } from "../../types/type";
import { getItem } from "../../utils/gameItems";
import { getUserData, removeWallet, addItem } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "modal",
    id: "shop_buy_modal",
    execute: async (interaction: ModalSubmitInteraction) => {
        const itemId = interaction.fields.getTextInputValue("item_id").toLowerCase();
        const quantityInput = interaction.fields.getTextInputValue("quantity");
        const quantity = parseInt(quantityInput) || 1;
        const userId = interaction.user.id;

        if (isNaN(quantity) || quantity <= 0) {
            return interaction.reply({ content: "Jumlah item gak valid bang!", ephemeral: true });
        }

        const item = getItem(itemId);
        if (!item) {
            return interaction.reply({ content: `Barang dengan ID \`${itemId}\` gak nemu. Cek /shop lagi.`, ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const userData = await getUserData(userId);
            const totalPrice = item.price * quantity;

            if (userData.wallet < totalPrice) {
                return interaction.editReply(`Duit lu kurang! Butuh **${formatRupiah(totalPrice)}** di wallet.`);
            }

            await removeWallet(userId, totalPrice);
            await addItem(userId, item.id, quantity);

            const embed = new EmbedBuilder()
                .setTitle("Pembelian Berhasil")
                .setDescription(`Lu baru aja beli **${quantity}x ${item.name}**!`)
                .addFields(
                    { name: "Total Harga", value: formatRupiah(totalPrice), inline: true },
                    { name: "Sisa Wallet", value: formatRupiah(userData.wallet - totalPrice), inline: true }
                )
                .setColor(0x00FF00)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("[ShopBuyModal] Error:", error);
            await interaction.editReply("Gagal beli barang. Ada masalah di database.");
        }
    },
} as ModalEvent;
