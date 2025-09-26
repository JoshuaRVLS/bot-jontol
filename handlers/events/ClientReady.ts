import { Events } from "discord.js";
import { ClientEvent } from "../../@types/type";

export default {
  once: true,
  type: "event",
  name: Events.ClientReady,
  execute: async () => console.log("Bot is online!"),
} as ClientEvent;
