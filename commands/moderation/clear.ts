import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { Command } from "../../types/type";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Hapus banyak pesan sekaligus")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Jumlah pesan (Max 100)")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const amount = interaction.options.getInteger("amount", true);

        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.channel;
        if (!channel || channel.type !== ChannelType.GuildText) {
            return interaction.followUp("Command ini cuma bisa dipakai di text channel biasa.");
        }

        try {
            const deleted = await channel.bulkDelete(amount, true);

            await interaction.followUp({ content: `✅ Berhasil menghapus **${deleted.size}** pesan.` });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal hapus pesan. Pesan yang lebih dari 14 hari gak bisa dihapus bulk (Batasan Discord).", ephemeral: true });
        }
    },
} as Command;
