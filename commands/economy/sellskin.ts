import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ChatInputCommandInteraction, ComponentType } from "discord.js";
import { Command } from "../../types/type";
import { getCSGOSkins, removeCSGOSkin, addWallet, clearCSGOSkins } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("sellskin")
        .setDescription("Jual koleksi skin CS:GO lu buat dapet Rupiah")
        .addSubcommand(sub =>
            sub.setName("select")
                .setDescription("Pilih satu skin buat dijual")
        )
        .addSubcommand(sub =>
            sub.setName("all")
                .setDescription("Jual SEMUA koleksi skin lu sekaligus (CUAN CEPET!)")
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const userId = interaction.user.id;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "all") {
            await interaction.deferReply();
            try {
                const skins = await getCSGOSkins(userId);
                if (skins.length === 0) {
                    return interaction.editReply("Lu gak punya skin CS:GO buat dijual bang. Gacha dulu di /sc!");
                }

                const totalValue = skins.reduce((acc, s) => acc + (s.marketPrice || 0), 0);

                // Clear all skins
                await clearCSGOSkins(userId);

                // Add total value to wallet
                await addWallet(userId, totalValue);

                const allEmbed = new EmbedBuilder()
                    .setTitle("Penjualan Massal Berhasil")
                    .setDescription(`Lu ngejual **${skins.length}** skin sekaligus!`)
                    .addFields(
                        { name: "Total Pemasukan", value: formatRupiah(totalValue), inline: true },
                        { name: "Status", value: "Duit udah meluncur ke wallet lu.", inline: true }
                    )
                    .setColor(0x00FF00)
                    .setTimestamp();

                return interaction.editReply({ embeds: [allEmbed] });
            } catch (error) {
                console.error("[SellSkin All Error]:", error);
                return interaction.editReply("Gagal borong skin lu. Ada kendala teknis.");
            }
        }

        // --- Select Mode (Previous Logic) ---
        const skins = await getCSGOSkins(userId);
        if (skins.length === 0) {
            return interaction.reply({ content: "Lu gak punya skin CS:GO buat dijual bang. Gacha dulu di /sc!", ephemeral: true });
        }

        const displaySkins = skins.slice(0, 25);
        const embed = new EmbedBuilder()
            .setTitle("Pasar Gelap Skin Jontol")
            .setDescription("Pilih skin yang mau lu jual dari menu di bawah.")
            .setColor(0xFFA500)
            .setFooter({ text: `Lu punya total ${skins.length} skin.` });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("select_sell_skin")
            .setPlaceholder("Pilih skin buat dijual...")
            .addOptions(
                displaySkins.map(s => ({
                    label: s.name.substring(0, 100),
                    description: `Harga: ${formatRupiah(s.marketPrice || 0)} | Wear: ${s.wear || "N/A"}`,
                    value: s.instanceId
                }))
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000
        });

        collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "Jangan ikut campur jualan orang bang!", ephemeral: true });
            }

            const instanceId = i.values[0];
            try {
                const removedSkin = await removeCSGOSkin(userId, instanceId);
                if (!removedSkin) {
                    return i.update({ content: "Skin-nya udah gak ada bang.", embeds: [], components: [] });
                }

                const price = removedSkin.marketPrice || 0;
                await addWallet(userId, price);

                const successEmbed = new EmbedBuilder()
                    .setTitle("Penjualan Berhasil")
                    .setDescription(`Lu ngejual **${removedSkin.name}** seharga **${formatRupiah(price)}**!`)
                    .addFields({ name: "Pemasukan", value: `+${formatRupiah(price)} masuk ke wallet!`, inline: true })
                    .setColor(0x00FF00)
                    .setTimestamp();

                await i.update({ embeds: [successEmbed], components: [] });
            } catch (error) {
                console.error("[SellSkin Error]:", error);
                await i.update({ content: "Gagal ngejual skin.", embeds: [], components: [] });
            }
        });

        collector.on("end", async (collected, reason) => {
            if (reason === "time" && collected.size === 0) {
                await interaction.editReply({ components: [] }).catch(() => { });
            }
        });
    },
} as Command;
