import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from "discord.js";
import { Command } from "../../types/type";
import prisma from "../../utils/Database";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("resetdb")
        .setDescription("⚠️ RESET SEMUA DATA DATABASE (DANGER)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        // Safety check: Only allow Administrator (already handled by permissions, but good to be safe)
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: "Lu bukan admin. Jangan macem-macem.", ephemeral: true });
        }

        const confirmButton = new ButtonBuilder()
            .setCustomId("confirm_reset")
            .setLabel("YA, HAPUS SEMUA")
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId("cancel_reset")
            .setLabel("GAK JADI")
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton);

        const response = await interaction.reply({
            content: "⚠️ **WARNING: ZONA BAHAYA** ⚠️\n\nLu yakin mau **RESET SEMUA DATA** (User, Money, Warnings, Inventory)?\nData yang ilang gak bisa balik lagi.",
            components: [row],
            ephemeral: true
        });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return;

            if (i.customId === "confirm_reset") {
                try {
                    await i.deferUpdate();

                    // Transactional delete? Or just sequential.
                    // MongoDB sometimes handles transactions differently, but sequential is fine here.
                    await prisma.warning.deleteMany({});
                    await prisma.user.deleteMany({});

                    await i.editReply({ content: "🚮 **DATABASE BERHASIL DI-RESET.** Semua data user kembali jadi 0.", components: [] });
                } catch (error) {
                    console.error("Reset Error:", error);
                    await i.editReply({ content: "❌ Gagal reset. Ada error.", components: [] });
                }
            } else {
                await i.update({ content: "✅ Operasi dibatalkan. Aman.", components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: "⏳ Waktu habis. Batal reset.", components: [] }).catch(() => { });
            }
        });
    },
} as Command;
