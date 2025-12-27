import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Events, Message } from "discord.js";
import { ClientEvent } from "../../types/type";
import { addXp, isUserExists, addNewUser } from "../../utils/Database";

export default {
    name: Events.MessageCreate,
    type: "event",
    once: false,
    execute: async (message: Message) => {
        // Ignore bots and DMs
        if (message.author.bot || !message.guild) return;

        try {
            const userId = message.author.id;

            // Should optimize this: don't check existence every message.
            // But for now, safe.
            const exists = await isUserExists(userId);
            if (!exists) {
                await addNewUser(userId);
            }

            // Add XP (Random 15-25 XP per message)
            const xpGain = Math.floor(Math.random() * (25 - 15 + 1)) + 15;

            // Add cooldown? Avoiding spam.
            // For now simple implementation.

            const result = await addXp(userId, xpGain);

            if (result.leveledUp) {
                const channel = message.channel;
                if (channel.type === ChannelType.GuildText) {
                    await channel.send(`🎉 **LEVEL UP!** Selamat <@${userId}>, lu naik ke **Level ${result.newLevel}**!`);
                }
            }

        } catch (error) {
            console.error("XP Error:", error);
        }
    },
} as ClientEvent;
