import { Events } from "discord.js";
import { ClientEvent } from "../../types/type";
import prisma from "../../utils/Database";
import { endGiveaway } from "../../utils/giveawayUtils";
import { getDistube } from "../../utils/player";

export default {
  once: true,
  type: "event",
  name: Events.ClientReady,
  execute: async (client: any) => {
    console.log("Bot is online!");

    getDistube(client);

    // Check giveaways every 10 seconds
    setInterval(async () => {
      const now = new Date();
      const endedGiveaways = await prisma.giveaway.findMany({
        where: {
          ended: false,
          endsAt: { lte: now }
        }
      });

      for (const giveaway of endedGiveaways) {
        await endGiveaway(giveaway.id, client);
      }
    }, 10000);
  },
} as ClientEvent;
