import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    ChatInputCommandInteraction
} from "discord.js";
import { Command } from "../../types/type";
import { getUserData, addWallet, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { createDeck, calculateScore, formatHand, Card } from "../../utils/blackjackHelper";
import { generateEconomyResponse } from "../../utils/aiHelper";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Main blackjack (21) lawan dealer. Adil 50:50!")
        .addNumberOption(opt =>
            opt.setName("bet")
                .setDescription("Jumlah taruhan lu")
                .setRequired(true)
                .setMinValue(5000)),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const userId = interaction.user.id;
        let bet = interaction.options.getNumber("bet", true);

        const userData = await getUserData(userId);
        if (userData.wallet < bet) {
            return interaction.reply({ content: `Duit lu kurang bang! Saldo lu cuma **${formatRupiah(userData.wallet)}**.`, ephemeral: true });
        }

        await interaction.deferReply();

        // Initial setup
        const deck = createDeck();
        // Burn one card (Standard Casino Rule)
        deck.pop();

        const playerHand: Card[] = [deck.pop()!, deck.pop()!];
        const dealerHand: Card[] = [deck.pop()!, deck.pop()!];

        const getEmbed = (isGameOver: boolean = false) => {
            const playerScore = calculateScore(playerHand);
            const dealerScore = isGameOver ? calculateScore(dealerHand) : calculateScore([dealerHand[0]]);

            const embed = new EmbedBuilder()
                .setTitle("🃏 Blackjack Jontol")
                .setColor(isGameOver ? (playerScore > 21 ? 0xFF0000 : (dealerScore > 21 || playerScore > dealerScore ? 0x00FF00 : (playerScore === dealerScore ? 0xFFFF00 : 0xFF0000))) : 0x0099FF)
                .addFields(
                    { name: `🙋‍♂️ Kartu Lu (${playerScore})`, value: formatHand(playerHand), inline: true },
                    { name: `🏢 Dealer (${isGameOver ? dealerScore : "?"})`, value: isGameOver ? formatHand(dealerHand) : `${formatHand([dealerHand[0]])} \`??\``, inline: true }
                )
                .setFooter({ text: `Taruhan: ${formatRupiah(bet)}` })
                .setTimestamp();

            return embed;
        };

        const getButtons = (disableDouble: boolean = false) => {
            return new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setCustomId("hit").setLabel("Hit").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("stand").setLabel("Stand").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("double").setLabel("Double Down").setStyle(ButtonStyle.Success).setDisabled(disableDouble),
                new ButtonBuilder().setCustomId("surrender").setLabel("Surrender").setStyle(ButtonStyle.Danger)
            );
        };

        const response = await interaction.editReply({
            embeds: [getEmbed()],
            components: [getButtons()]
        });

        // Deduct bet initially
        await removeWallet(userId, bet);

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: i => i.user.id === userId,
            time: 60000
        });

        collector.on("collect", async (i) => {
            if (i.customId === "hit") {
                playerHand.push(deck.pop()!);
                const score = calculateScore(playerHand);

                if (score > 21) {
                    collector.stop("bust");
                } else if (score === 21) {
                    collector.stop("blackjack");
                } else {
                    // Disable Double Down and Surrender after first hit
                    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder().setCustomId("hit").setLabel("Hit").setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId("stand").setLabel("Stand").setStyle(ButtonStyle.Secondary)
                    );
                    await i.update({ embeds: [getEmbed()], components: [row] });
                }
            } else if (i.customId === "stand") {
                collector.stop("stand");
            } else if (i.customId === "double") {
                // Check balance logic
                const currentUserData = await getUserData(userId);
                if (currentUserData.wallet < bet) {
                    await i.reply({ content: `Duit lu kurang buat Double Down! Butuh **${formatRupiah(bet)}** lagi.`, ephemeral: true });
                    return;
                }

                // Deduct extra bet
                await removeWallet(userId, bet);
                bet *= 2; // Double the bet

                // Hit exactly once
                playerHand.push(deck.pop()!);

                // Immediately end turn (stand or bust)
                const score = calculateScore(playerHand);
                if (score > 21) {
                    collector.stop("bust");
                } else {
                    collector.stop("stand");
                }
            } else if (i.customId === "surrender") {
                collector.stop("surrender");
            }
        });

        collector.on("end", async (_, reason) => {
            if (reason === "surrender") {
                const refund = bet / 2;
                await addWallet(userId, refund);

                const finalEmbed = getEmbed(true);
                finalEmbed.setTitle("🏳️ Surrender");
                finalEmbed.setDescription(`Lu nyerah. Duit balik setengah (**${formatRupiah(refund)}**).`);
                finalEmbed.setColor(0xFFA500); // Orange

                await interaction.editReply({
                    embeds: [finalEmbed],
                    components: []
                });
                return;
            }

            let playerScore = calculateScore(playerHand);
            let dealerScore = calculateScore(dealerHand);

            // Dealer logic: Hit until 17
            if (reason === "stand" || reason === "blackjack") {
                while (dealerScore < 17) {
                    dealerHand.push(deck.pop()!);
                    dealerScore = calculateScore(dealerHand);
                }
            }

            let resultMsg = "";
            let winMultiplier = 0; // 0 = lose, 1 = push (tie), 2 = win

            if (playerScore > 21) {
                resultMsg = "💥 **BUST!** Lu kalah bang.";
                winMultiplier = 0;
            } else if (dealerScore > 21) {
                resultMsg = "🎉 **DEALER BUST!** Lu menang!";
                winMultiplier = 2; // Normal win returns 2x bet (profit 1x)
            } else if (playerScore > dealerScore) {
                resultMsg = "🏆 **MENANG!** Kartu lu lebih gede.";
                winMultiplier = 2;
            } else if (playerScore < dealerScore) {
                resultMsg = "💀 **KALAH!** Dealer lebih sakti.";
                winMultiplier = 0;
            } else {
                resultMsg = "🤝 **PUSH!** Seri, duit balik.";
                winMultiplier = 1;
            }

            // Blackjack payoff 3:2 (2.5x total return) - Only on natural 21 with 2 cards
            if (playerScore === 21 && playerHand.length === 2 && winMultiplier === 2) {
                resultMsg = "🃏 **BLACKJACK!** King of Gambling!";
                winMultiplier = 2.5;
            }

            if (winMultiplier > 0) {
                await addWallet(userId, Math.floor(bet * winMultiplier));
            }

            // AI commentary
            const aiContext = `Blackjack result: ${resultMsg.replace(/\*/g, '')}. Player score: ${playerScore}, Dealer: ${dealerScore}. Bet: ${formatRupiah(bet)}.`;
            const aiComment = await generateEconomyResponse("blackjack", aiContext);

            const finalEmbed = getEmbed(true);
            finalEmbed.setDescription(`${resultMsg}\n\n> ${aiComment || "Gak bisa berkata-kata gue."}`);
            // Payout info in footer
            if (winMultiplier > 0) {
                finalEmbed.setFooter({ text: `Payout: ${formatRupiah(Math.floor(bet * winMultiplier))}` });
            }

            await interaction.editReply({
                embeds: [finalEmbed],
                components: []
            });
        });
    },
} as Command;
