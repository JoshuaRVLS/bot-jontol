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
import { getUserData, addCSGOSkins, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { getSkinPrice, getWeightedSkin, getSkinFloat } from "../../utils/csgoHelper";

const API_URL = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json";

let skinsCache: any[] | null = null;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
                .addIntegerOption(opt => opt.setName("price").setDescription("Modal per ronde (Default: 100k)").setMinValue(10000).setMaxValue(50000000).setRequired(false))
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const challenger = interaction.user;
        const target = interaction.options.getUser("target", true);
        const rounds = interaction.options.getInteger("rounds", true);
        const pricePerRound = interaction.options.getInteger("price") || 100000;
        const totalCost = pricePerRound * rounds;

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
            .setDescription(`### ${challenger} nantangin ${target} buat Battle!\n\n**Detail Battle:**\n• **Total Ronde:** ${rounds}\n• **Modal / Ronde:** ${formatRupiah(pricePerRound)}\n• **Total Taruhan:** ${formatRupiah(totalCost)}\n\n> **INFO:** Kalau diterima, bot bakal bikin **Channel Privat** baru buat battle kalian!`)
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
                    if (!skinsCache) {
                        const res = await fetch(API_URL);
                        skinsCache = await res.json();
                    }

                    // Create Private Channel
                    const guild = interaction.guild!;
                    const battleChannel = await guild.channels.create({
                        name: `battle-${challenger.username}-vs-${target.username}`.substring(0, 32),
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                            { id: challenger.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                            { id: target.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                            { id: interaction.client.user!.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                        ]
                    });

                    await interaction.followUp({ content: `✅ Arena siap bang! Langsung gas ke ${battleChannel}!`, ephemeral: false });

                    // Deduct
                    await removeWallet(challenger.id, totalCost);
                    await removeWallet(target.id, totalCost);

                    let challengerTotal = 0;
                    let targetTotal = 0;
                    const challengerPulls: any[] = [];
                    const targetPulls: any[] = [];

                    for (let r = 1; r <= rounds; r++) {
                        // REVEAL PHASE
                        const initEmbed = new EmbedBuilder()
                            .setTitle(`⚔️ BATTLE: ROUND ${r}/${rounds}`)
                            .setDescription(`🎰 **Gacha lagi di-roll...**`)
                            .setColor(0xFEE75C)
                            .addFields(
                                { name: `🙋‍♂️ ${challenger.username}`, value: `Rolling... 🎲`, inline: true },
                                { name: `🎯 ${target.username}`, value: `Rolling... 🎲`, inline: true },
                                { name: `📊 Skor Sementara`, value: `**${challenger.username}**: ${formatRupiah(challengerTotal)}\n**${target.username}**: ${formatRupiah(targetTotal)}`, inline: false }
                            );

                        const roundMsg = await battleChannel.send({ embeds: [initEmbed] });

                        await sleep(2000);

                        // Reveal Challenger
                        const cSkin = getWeightedSkin(skinsCache!);
                        const cFloat = getSkinFloat();
                        const cPrice = getSkinPrice(cSkin.rarity?.name || "Consumer Grade", cFloat.float);
                        challengerPulls.push({ ...cSkin, marketPrice: cPrice, ...cFloat });
                        challengerTotal += cPrice;

                        const revealCEmbed = EmbedBuilder.from(initEmbed)
                            .setColor(cSkin.rarity?.color || 0xFEE75C)
                            .setFields(
                                { name: `🙋‍♂️ ${challenger.username}`, value: `✨ **${cSkin.weapon?.name} | ${cSkin.pattern?.name}**\nPrice: ${formatRupiah(cPrice)}`, inline: true },
                                { name: `🎯 ${target.username}`, value: `Rolling... 🎲`, inline: true },
                                { name: `📊 Skor Sementara`, value: `**${challenger.username}**: ${formatRupiah(challengerTotal)}\n**${target.username}**: ${formatRupiah(targetTotal)}`, inline: false }
                            )
                            .setImage(cSkin.image);

                        await roundMsg.edit({ embeds: [revealCEmbed] });
                        await sleep(2000);

                        // Reveal Target
                        const tSkin = getWeightedSkin(skinsCache!);
                        const tFloat = getSkinFloat();
                        const tPrice = getSkinPrice(tSkin.rarity?.name || "Consumer Grade", tFloat.float);
                        targetPulls.push({ ...tSkin, marketPrice: tPrice, ...tFloat });
                        targetTotal += tPrice;

                        const revealBothEmbed = EmbedBuilder.from(revealCEmbed)
                            .setColor(tPrice > cPrice ? (tSkin.rarity?.color || 0x00FF00) : (cSkin.rarity?.color || 0x00FF00))
                            .setFields(
                                { name: `🙋‍♂️ ${challenger.username}`, value: `✨ **${cSkin.weapon?.name} | ${cSkin.pattern?.name}**\nPrice: ${formatRupiah(cPrice)}`, inline: true },
                                { name: `🎯 ${target.username}`, value: `✨ **${tSkin.weapon?.name} | ${tSkin.pattern?.name}**\nPrice: ${formatRupiah(tPrice)}`, inline: true },
                                { name: `📊 Skor Sementara`, value: `**${challenger.username}**: ${formatRupiah(challengerTotal)}\n**${target.username}**: ${formatRupiah(targetTotal)}`, inline: false }
                            )
                            .setImage(tPrice > cPrice ? tSkin.image : cSkin.image)
                            .setFooter({ text: `Leader: ${challengerTotal > targetTotal ? challenger.username : (targetTotal > challengerTotal ? target.username : "Tie")}` });

                        await roundMsg.edit({ embeds: [revealBothEmbed] });
                        await sleep(3000);
                    }

                    // FINAL RESULT
                    let winnerId = "";
                    let winnerName = "";
                    let isTie = false;

                    if (challengerTotal > targetTotal) {
                        winnerId = challenger.id; winnerName = challenger.username;
                    } else if (targetTotal > challengerTotal) {
                        winnerId = target.id; winnerName = target.username;
                    } else {
                        isTie = true;
                        if (Math.random() > 0.5) { winnerId = challenger.id; winnerName = challenger.username; }
                        else { winnerId = target.id; winnerName = target.username; }
                    }

                    const allSkins = [...challengerPulls, ...targetPulls];
                    await addCSGOSkins(winnerId, allSkins);

                    const finalEmbed = new EmbedBuilder()
                        .setTitle(`🏆 BATTLE OVER: ${winnerName} MENANG!`)
                        .setDescription(`💸 **WINNER TAKES ALL!**\nSikat semua **${allSkins.length} skin** dengan total estimasi **${formatRupiah(challengerTotal + targetTotal)}**!${isTie ? "\n\n*(Hasil seri, pemenang ditentukan lewat final coinflip)*" : ""}`)
                        .setColor(0x00FF00)
                        .setFields(
                            { name: `🙋‍♂️ ${challenger.username}`, value: `Total: **${formatRupiah(challengerTotal)}**`, inline: true },
                            { name: `🎯 ${target.username}`, value: `Total: **${formatRupiah(targetTotal)}**`, inline: true }
                        )
                        .setThumbnail(challengerTotal > targetTotal ? challenger.displayAvatarURL() : target.displayAvatarURL())
                        .setFooter({ text: "Channel ini bakal dihapus dalam 60 detik." })
                        .setTimestamp();

                    await battleChannel.send({ content: `🎉 **SELAMAT LU MENANG ${winnerName}!**`, embeds: [finalEmbed] });

                    setTimeout(() => {
                        battleChannel.delete().catch(console.error);
                    }, 60000);

                } catch (error) {
                    console.error("Battle execution error:", error);
                    await interaction.followUp("Gagal nge-run battle bang. Hubungi dev!");
                }
            }
        });
    },
} as Command;
