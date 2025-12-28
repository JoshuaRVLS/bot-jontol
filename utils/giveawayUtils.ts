import { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from "discord.js";
import prisma from "./Database";

export async function endGiveaway(giveawayId: string, client: Client) {
    const giveaway = await prisma.giveaway.findUnique({
        where: { id: giveawayId },
    });

    if (!giveaway || giveaway.ended) return;

    // Pick winners
    const participants = giveaway.participants;
    const winnersCount = giveaway.winnersCount;
    const winners: string[] = [];

    if (participants.length <= winnersCount) {
        winners.push(...participants);
    } else {
        while (winners.length < winnersCount) {
            const randomIndex = Math.floor(Math.random() * participants.length);
            const winnerId = participants[randomIndex];
            if (!winners.includes(winnerId)) {
                winners.push(winnerId);
            }
        }
    }

    // Update DB
    await prisma.giveaway.update({
        where: { id: giveawayId },
        data: {
            ended: true,
            winners: winners,
        },
    });

    // Update Message
    try {
        const channel = await client.channels.fetch(giveaway.channelId) as TextChannel;
        if (channel) {
            const message = await channel.messages.fetch(giveaway.messageId);
            if (message) {
                const winnersString = winners.length > 0 ? winners.map(w => `<@${w}>`).join(", ") : "No one joined :(";

                const embed = new EmbedBuilder()
                    .setTitle("🎉 GIVEAWAY ENDED 🎉")
                    .setDescription(`Price: **${giveaway.prize}**\n\nWinner(s): ${winnersString}\nHosted by: <@${giveaway.hostId}>`)
                    .setColor(0x2F3136)
                    .setFooter({ text: "Ended at" })
                    .setTimestamp(new Date());

                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("giveaway_join")
                            .setLabel("Ended")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    );

                await message.edit({ embeds: [embed], components: [row] });

                if (winners.length > 0) {
                    await channel.send(`Congratulation ${winnersString}! You won **${giveaway.prize}**!`);
                }
            }
        }
    } catch (error) {
        console.error("Error updating giveaway message:", error);
    }
}
