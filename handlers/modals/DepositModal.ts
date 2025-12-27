import { Interaction } from "discord.js";
import { ModalEvent } from "../../types/type";
import { addBank, removeWallet, getUserData } from "../../utils/Database";

export default {
    type: "modal",
    id: "deposit_modal",
    execute: async (interaction: Interaction) => {
        if (!interaction.isModalSubmit()) return;

        const inputAmount = interaction.fields.getTextInputValue("deposit_amount");
        const userId = interaction.user.id;
        const userData = await getUserData(userId);

        let amount = 0;

        if (inputAmount.toLowerCase() === "all") {
            amount = userData.wallet;
        } else {
            amount = parseInt(inputAmount);
        }

        if (isNaN(amount) || amount <= 0) {
            return interaction.reply({ content: "Masukin angka yang bener dong bang!", ephemeral: true });
        }

        if (amount > userData.wallet) {
            return interaction.reply({ content: "Duit lu kurang bang, jangan ngadi-ngadi.", ephemeral: true });
        }

        try {
            await removeWallet(userId, amount);
            await addBank(userId, amount);
            await interaction.reply({ content: `✅ Berhasil deposit **${amount}** coins ke bank!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Gagal deposit, database lagi error keknya.", ephemeral: true });
        }
    },
} as ModalEvent;
