import { Events, GuildMember, AttachmentBuilder, TextChannel, PartialGuildMember } from "discord.js";
import { ClientEvent } from "../../types/type";
import ExtendedClient from "../../ExtendedClient/ExtendedClient";
import { generateCard } from "../../utils/cardGenerator";

export default {
    once: false,
    type: "event",
    name: Events.GuildMemberRemove,
    execute: async (member: GuildMember | PartialGuildMember, client: ExtendedClient) => {
        try {
            const { getGuildConfig } = await import("../../utils/Database");
            const config = await getGuildConfig(member.guild.id);

            // Priority: Dashboard Config -> Leave/Exit Name -> System Channel
            let leaveChannel: TextChannel | null = null;
            if (config?.leaveChannelId) {
                leaveChannel = member.guild.channels.cache.get(config.leaveChannelId) as TextChannel;
            }

            if (!leaveChannel) {
                leaveChannel = member.guild.channels.cache.find(
                    (ch) => ["leave", "exit", "goodbye", "keluar"].includes(ch.name.toLowerCase())
                ) as TextChannel || member.guild.systemChannel;
            }

            if (!leaveChannel) return;

            // @ts-ignore
            const buffer = await generateCard(member, "leave");
            const attachment = new AttachmentBuilder(buffer, { name: "leave.png" });

            let leaveMsg = config?.leaveMessage || `**${member.user?.tag}** just left the server. See you soon!`;
            leaveMsg = leaveMsg.replace(/{user}/g, `${member.user?.tag}`).replace(/{server}/g, member.guild.name);

            await leaveChannel.send({
                content: leaveMsg,
                files: [attachment]
            });
        } catch (error) {
            console.error("[Event: GuildMemberRemove] Error generating card:", error);
        }
    },
} as ClientEvent;
