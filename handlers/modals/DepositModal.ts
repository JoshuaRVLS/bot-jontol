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

            // Update Embed
            // Fetch fresh data
            const updatedUserData = await getUserData(userId);
            const { createBalanceEmbed } = await import("../../utils/uiFactory");

            const newEmbed = createBalanceEmbed(interaction.user, updatedUserData);

            // Update the message that triggered the modal (if applicable)
            await (interaction as any).update({
                content: `✅ Berhasil deposit **${amount.toLocaleString()}** coins ke bank!`,
                embeds: [newEmbed],
                components: [(await import("../../utils/uiFactory")).createBalanceButtons()]
            });

        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "Gagal deposit, database lagi error keknya.", ephemeral: true });
            } else {
                await interaction.reply({ content: "Gagal deposit, database lagi error keknya.", ephemeral: true });
            }
        }
    },
} as ModalEvent;
