import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    ChatInputCommandInteraction,
    ChannelType,
    PermissionFlagsBits,
    TextChannel
} from "discord.js";
import { Command } from "../../types/type";
import { getUserData, removeWallet, addCSGOSkins } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { getSkinPrice, getWeightedSkin, getSkinFloat, CASE_CONFIGS, CaseType } from "../../utils/csgoHelper";

const API_URL = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json";

let skinsCache: any[] | null = null;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchSkins = async () => {
    if (!skinsCache) {
        const response = await fetch(API_URL);
        skinsCache = await response.json();
    }
    return skinsCache!;
};

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("battle")
        .setDescription("Battle gacha skin CS:GO (Winner Takes All!)")
        .addSubcommand(sub =>
            sub.setName("challenge")
                .setDescription("Challenge user buat adu keberuntungan di channel privat")
                .addUserOption(opt => opt.setName("target").setDescription("User yang mau di-challenge").setRequired(true))
                .addIntegerOption(opt => opt.setName("rounds").setDescription("Jumlah ronde (1-10)").setMinValue(1).setMaxValue(10).setRequired(true))
                .addStringOption(opt =>
                    opt.setName("case")
                        .setDescription("Pilih jenis case buat battle")
                        .setRequired(true)
                        .addChoices(
                            { name: "Standard Case (1M)", value: "highroller" },
                            { name: "Special Case (10M)", value: "elite" },
                            { name: "Omega Case (100M)", value: "sultan" },
                            { name: "Kasta Tuhan (5Miliar)", value: "godtier" }
                        )
                )
                .addBooleanOption(option =>
                    option.setName("crazy")
                        .setDescription("Crazy Mode: Yang paling murah yang menang!")
                        .setRequired(false)
                )
                .addBooleanOption(option =>
                    option.setName("team")
                        .setDescription("Team Mode: 2vs2 CT vs T!")
                        .setRequired(false)
                )
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const challenger = interaction.user;
        const target = interaction.options.getUser("target", true);
        const rounds = interaction.options.getInteger("rounds", true);
        const caseId = interaction.options.getString("case", true) as CaseType;
        const isCrazy = interaction.options.getBoolean("crazy") || false;
        const isTeam = interaction.options.getBoolean("team") || false;
        const config = CASE_CONFIGS[caseId];

        const totalCost = config.cost * rounds;

        if (isTeam) {
            return interaction.reply({ content: "Team Mode (CT vs T) buat saat ini baru ada di versi Web (Dashboard) bang! Cobain di sana bareng temen berempat.", ephemeral: true });
        }

        if (target.id === challenger.id) {
            return interaction.reply({ content: "Lu mau battle lawan diri sendiri? Kesepian amat bang.", ephemeral: true });
        }

        if (target.bot) {
            return interaction.reply({ content: "Bot gak punya emosi, jangan di-challenge bang.", ephemeral: true });
        }

        const challengerData = await getUserData(challenger.id);
        if (challengerData.wallet < totalCost) {
            return interaction.reply({
                content: `Duit lu gak cukup buat battle **${rounds} ronde**! Butuh **${formatRupiah(totalCost)}**.`,
                ephemeral: true
            });
        }

        const inviteEmbed = new EmbedBuilder()
            .setTitle("⚔️ GACHA BATTLE CHALLENGE!")
            .setDescription(`### ${challenger} nantangin ${target} buat Battle!\n\n**Detail Battle:**\n• **Total Ronde:** ${rounds}\n• **Case:** ${config.name}\n• **Modal / Ronde:** ${formatRupiah(config.cost)}\n• **Total Taruhan:** ${formatRupiah(totalCost)}\n• **Mode:** ${isCrazy ? "🤪 Crazy Mode" : "Normal"}\n\n> **INFO:** Kalau diterima, bot bakal bikin **Channel Privat** baru buat battle kalian!`)
            .setColor(0xFFA500)
            .setFooter({ text: "Waktu terima: 60 detik" })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId("accept").setLabel("Terima Challenge").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("decline").setLabel("Tolak").setStyle(ButtonStyle.Danger)
        );

        const response = await interaction.reply({
            content: `${target}`,
            embeds: [inviteEmbed],
            components: [row]
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: i => i.user.id === target.id,
            time: 60000
        });

        collector.on("collect", async (i) => {
            if (i.customId === "decline") {
                await i.update({ content: `❌ ${target} nolak challenge dari ${challenger}.`, embeds: [], components: [] });
                return collector.stop("declined");
            }

            if (i.customId === "accept") {
                const targetData = await getUserData(target.id);
                if (targetData.wallet < totalCost) {
                    await i.update({ content: `❌ Duit ${target} gak cukup buat nerima challenge ini!`, embeds: [], components: [] });
                    return collector.stop("insufficient_funds");
                }

                await i.update({ content: `🔄 **Challenge Diterima!** Menyiapkan arena privat...`, embeds: [], components: [] });
                collector.stop("accepted");

                try {
                    await removeWallet(challenger.id, totalCost);
                    await removeWallet(target.id, totalCost);

                    const guild = interaction.guild!;
                    const battleChannel = await guild.channels.create({
                        name: `battle-${challenger.username}-vs-${target.username}`,
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                            { id: challenger.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                            { id: target.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                            { id: interaction.client.user!.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
                        ]
                    });

                    await interaction.followUp({
                        content: `${challenger} ${target} Arena sudah siap! Klik ${battleChannel} untuk masuk.`
                    });

                    const skins = await fetchSkins();

                    const introEmbed = new EmbedBuilder()
                        .setTitle("⚔️ BATTLE DIMULAI!")
                        .setDescription(`**${challenger.username}** vs **${target.username}**\n\n**Case:** ${config.name}\n**Total Ronde:** ${rounds}\n**Mode:** ${isCrazy ? "🤪 Crazy Mode" : "Normal"}\n**Total Pot:** ${formatRupiah(totalCost * 2)}`)
                        .setColor(isCrazy ? 0xFF00FF : 0xFF0000)
                        .setTimestamp();

                    await battleChannel.send({ embeds: [introEmbed] });
                    await sleep(2000);

                    const challengerSkins: any[] = [];
                    const targetSkins: any[] = [];
                    let challengerTotal = 0;
                    let targetTotal = 0;

                    for (let round = 1; round <= rounds; round++) {
                        const roundEmbed = new EmbedBuilder()
                            .setTitle(`🎰 RONDE ${round}/${rounds}`)
                            .setDescription("Rolling...")
                            .setColor(0xFFD700);

                        const roundMsg = await battleChannel.send({ embeds: [roundEmbed] });
                        await sleep(1500);

                        const challengerRaw = getWeightedSkin(skins, caseId, 0);
                        const { float: cFloat, wear: cWear } = getSkinFloat();
                        const cPrice = await getSkinPrice(challengerRaw, cFloat);
                        const challengerSkin = {
                            ...challengerRaw,
                            name: `${challengerRaw.weapon?.name} | ${challengerRaw.pattern?.name}`,
                            marketPrice: cPrice,
                            float: cFloat,
                            wear: cWear,
                            instanceId: `${challengerRaw.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
                        };
                        challengerSkins.push(challengerSkin);
                        challengerTotal += cPrice;

                        const targetRaw = getWeightedSkin(skins, caseId, 0);
                        const { float: tFloat, wear: tWear } = getSkinFloat();
                        const tPrice = await getSkinPrice(targetRaw, tFloat);
                        const targetSkin = {
                            ...targetRaw,
                            name: `${targetRaw.weapon?.name} | ${targetRaw.pattern?.name}`,
                            marketPrice: tPrice,
                            float: tFloat,
                            wear: tWear,
                            instanceId: `${targetRaw.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
                        };
                        targetSkins.push(targetSkin);
                        targetTotal += tPrice;

                        const resultEmbed = new EmbedBuilder()
                            .setTitle(`🎰 RONDE ${round}/${rounds}`)
                            .addFields(
                                { name: `${challenger.username}`, value: `**${challengerSkin.name}**\n${challengerSkin.rarity?.name || "Unknown"}\n${formatRupiah(cPrice)}`, inline: true },
                                { name: "VS", value: "⚔️", inline: true },
                                { name: `${target.username}`, value: `**${targetSkin.name}**\n${targetSkin.rarity?.name || "Unknown"}\n${formatRupiah(tPrice)}`, inline: true }
                            )
                            .setColor(cPrice > tPrice ? 0x00FF00 : tPrice > cPrice ? 0xFF0000 : 0xFFFFFF)
                            .setFooter({ text: cPrice > tPrice ? `${challenger.username} menang ronde ini!` : tPrice > cPrice ? `${target.username} menang ronde ini!` : "Seri!" });

                        await roundMsg.edit({ embeds: [resultEmbed] });
                        await sleep(2000);
                    }

                    const allSkins = [...challengerSkins, ...targetSkins];
                    const challengerWins = isCrazy ? challengerTotal < targetTotal : challengerTotal > targetTotal;
                    const winner = challengerWins ? challenger : target;
                    const winnerTotal = challengerWins ? challengerTotal : targetTotal;
                    const loserTotal = challengerWins ? targetTotal : challengerTotal;

                    await addCSGOSkins(winner.id, allSkins);

                    const finalEmbed = new EmbedBuilder()
                        .setTitle("🏆 BATTLE SELESAI!")
                        .setDescription(`### ${winner} MENANG!\n\n**Total Skin:** ${allSkins.length} skins\n**Total Value:** ${formatRupiah(challengerTotal + targetTotal)}`)
                        .addFields(
                            { name: `${challenger.username}`, value: `${formatRupiah(challengerTotal)}`, inline: true },
                            { name: `${target.username}`, value: `${formatRupiah(targetTotal)}`, inline: true }
                        )
                        .setColor(0xFFD700)
                        .setFooter({ text: "Channel ini akan dihapus dalam 30 detik..." })
                        .setTimestamp();

                    await battleChannel.send({ content: `${challenger} ${target}`, embeds: [finalEmbed] });

                    await sleep(30000);
                    await battleChannel.delete().catch(() => { });

                } catch (error) {
                    console.error("Battle error:", error);
                    await interaction.followUp("Gagal bikin battle arena bang. Hubungi dev!");
                }
            }
        });
    },
} as Command;
