import { Events, GuildMember, AttachmentBuilder, TextChannel } from "discord.js";
import { ClientEvent } from "../../types/type";
import ExtendedClient from "../../ExtendedClient/ExtendedClient";
import { generateCard } from "../../utils/cardGenerator";

export default {
    once: false,
    type: "event",
    name: Events.GuildMemberAdd,
    execute: async (member: GuildMember, client: ExtendedClient) => {
        try {
            const { getGuildConfig } = await import("../../utils/Database");
            const config = await getGuildConfig(member.guild.id);

            // Priority: Dashboard Config -> Welcome/Selamat-Datang Name -> System Channel
            let welcomeChannel: TextChannel | null = null;
            if (config?.welcomeChannelId) {
                welcomeChannel = member.guild.channels.cache.get(config.welcomeChannelId) as TextChannel;
            }

            if (!welcomeChannel) {
                welcomeChannel = member.guild.channels.cache.find(
                    (ch) => ch.name.toLowerCase() === "welcome" || ch.name.toLowerCase() === "selamat-datang"
                ) as TextChannel || member.guild.systemChannel;
            }

            if (!welcomeChannel) return;

            const buffer = await generateCard(member, "welcome");
            const attachment = new AttachmentBuilder(buffer, { name: "welcome.png" });

            let welcomeMsg = config?.welcomeMessage || `Welcome to **${member.guild.name}**, ${member}!`;
            welcomeMsg = welcomeMsg.replace(/{user}/g, `${member}`).replace(/{server}/g, member.guild.name);

            await welcomeChannel.send({
                content: welcomeMsg,
                files: [attachment]
            });
        } catch (error) {
            console.error("[Event: GuildMemberAdd] Error generating card:", error);
        }
    },
} as ClientEvent;
