import { Interaction } from "discord.js";
import { ModalEvent } from "../../types/type";
import { addWallet, removeBank, getUserData } from "../../utils/Database";

export default {
    type: "modal",
    id: "withdraw_modal",
    execute: async (interaction: Interaction) => {
        if (!interaction.isModalSubmit()) return;

        const inputAmount = interaction.fields.getTextInputValue("withdraw_amount");
        const userId = interaction.user.id;
        const userData = await getUserData(userId);

        let amount = 0;

        if (inputAmount.toLowerCase() === "all") {
            amount = userData.bank;
        } else {
            amount = parseInt(inputAmount);
        }

        if (isNaN(amount) || amount <= 0) {
            return interaction.reply({ content: "Masukin angka yang bener dong bang!", ephemeral: true });
        }

        if (amount > userData.bank) {
            return interaction.reply({ content: "Tabungan lu kurang bang, kerja dulu sana!", ephemeral: true });
        }

        try {
            await removeBank(userId, amount);
            await addWallet(userId, amount);
            await interaction.reply({ content: `✅ Berhasil narik **${amount}** coins dari bank!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Gagal narik duit, bank lagi error.", ephemeral: true });
        }
    },
} as ModalEvent;
