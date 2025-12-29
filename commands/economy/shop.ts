import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChatInputCommandInteraction, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command } from "../../types/type";
import { ITEMS, ITEMS_PER_PAGE, GameItem } from "../../utils/gameItems";
import { formatRupiah } from "../../utils/format";

const generateShopEmbed = (items: GameItem[], page: number, totalPages: number, category: string) => {
    const start = page * ITEMS_PER_PAGE;
    const pageItems = items.slice(start, start + ITEMS_PER_PAGE);

    const embed = new EmbedBuilder()
        .setTitle(`Pasar Jontol`)
        .setDescription(`**Kategori:** ${category.charAt(0).toUpperCase() + category.slice(1)}\nGunakan ID item untuk melakukan pembelian.`)
        .setColor(0x00A2FF)
        .setFooter({ text: `Halaman ${page + 1} dari ${totalPages}` });

    pageItems.forEach((item, index) => {
        embed.addFields({
            name: `${start + index + 1}. ${item.name}`,
            value: `Harga: ${formatRupiah(item.price)}\n${item.description}\nID: \`${item.id}\``,
            inline: true
        });
    });

    return embed;
};

const generateButtons = (page: number, totalPages: number) => {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId("shop_prev")
            .setLabel("Prev")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === 0),
        new ButtonBuilder()
            .setCustomId("shop_page")
            .setLabel(`${page + 1}/${totalPages}`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId("shop_next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page >= totalPages - 1),
        new ButtonBuilder()
            .setCustomId("shop_buy")
            .setLabel("Beli")
            .setStyle(ButtonStyle.Success)
    );
    return row;
};

const generateCategorySelect = (currentCategory: string) => {
    const categories = ["all", "defense", "tool", "weapon", "vehicle", "pet", "consumable", "collectible", "rare", "legendary"];

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("shop_category")
            .setPlaceholder("Pilih Kategori")
            .addOptions(
                categories.map(cat => ({
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                    value: cat,
                    default: cat === currentCategory
                }))
            )
    );
    return row;
};

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Liat barang-barang yang dijual di pasar gelap"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        let currentPage = 0;
        let currentCategory = "all";

        const getFilteredItems = () => {
            if (currentCategory === "all") return ITEMS;
            return ITEMS.filter(item => item.type === currentCategory);
        };

        const getTotalPages = () => Math.ceil(getFilteredItems().length / ITEMS_PER_PAGE) || 1;

        const reply = await interaction.reply({
            embeds: [generateShopEmbed(getFilteredItems(), currentPage, getTotalPages(), currentCategory)],
            components: [generateCategorySelect(currentCategory), generateButtons(currentPage, getTotalPages())],
            fetchReply: true
        });

        const collector = reply.createMessageComponentCollector({
            time: 120000
        });

        collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: "Ini bukan shop lu bro!", ephemeral: true });
                return;
            }

            if (i.isStringSelectMenu() && i.customId === "shop_category") {
                currentCategory = i.values[0];
                currentPage = 0;
                await i.update({
                    embeds: [generateShopEmbed(getFilteredItems(), currentPage, getTotalPages(), currentCategory)],
                    components: [generateCategorySelect(currentCategory), generateButtons(currentPage, getTotalPages())]
                });
            } else if (i.isButton()) {
                if (i.customId === "shop_prev") {
                    currentPage = Math.max(0, currentPage - 1);
                    await i.update({
                        embeds: [generateShopEmbed(getFilteredItems(), currentPage, getTotalPages(), currentCategory)],
                        components: [generateCategorySelect(currentCategory), generateButtons(currentPage, getTotalPages())]
                    });
                } else if (i.customId === "shop_next") {
                    currentPage = Math.min(getTotalPages() - 1, currentPage + 1);
                    await i.update({
                        embeds: [generateShopEmbed(getFilteredItems(), currentPage, getTotalPages(), currentCategory)],
                        components: [generateCategorySelect(currentCategory), generateButtons(currentPage, getTotalPages())]
                    });
                } else if (i.customId === "shop_buy") {
                    const modal = new ModalBuilder()
                        .setCustomId("shop_buy_modal")
                        .setTitle("Beli Item");

                    const itemIdInput = new TextInputBuilder()
                        .setCustomId("item_id")
                        .setLabel("Masukkan ID Item")
                        .setPlaceholder("Contoh: shield, laptop, katana")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const quantityInput = new TextInputBuilder()
                        .setCustomId("quantity")
                        .setLabel("Jumlah (default: 1)")
                        .setPlaceholder("1")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false);

                    modal.addComponents(
                        new ActionRowBuilder<TextInputBuilder>().addComponents(itemIdInput),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(quantityInput)
                    );

                    await i.showModal(modal);
                }
            }
        });

        collector.on("end", async () => {
            try {
                await reply.edit({
                    components: []
                });
            } catch { }
        });
    },
} as Command;
