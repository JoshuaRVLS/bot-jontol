import { Client, Events, Interaction, MessageFlags } from "discord.js";
import { ClientEvent } from "../../types/type";
import ExtendedClient from "../../ExtendedClient/ExtendedClient";

export default {
  once: false,
  type: "event",
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction, client: ExtendedClient) => {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
          console.error(`No command matching ${interaction.commandName} was found.`);
          return;
        }
        await command.execute(interaction);

        // --- COMMAND XP REWARD & METADATA SYNC ---
        try {
          const xpGained = Math.floor(Math.random() * 11) + 5; // 5-15 XP
          const { default: prisma } = await import("../../utils/Database");

          // Sync name and avatar
          await prisma.user.upsert({
            where: { id: interaction.user.id },
            update: {
              name: interaction.user.username,
              avatar: interaction.user.displayAvatarURL(),
            },
            create: {
              id: interaction.user.id,
              name: interaction.user.username,
              avatar: interaction.user.displayAvatarURL(),
            },
          });

          const { addXp } = await import("../../utils/Database");
          const { leveledUp, newLevel } = await addXp(interaction.user.id, xpGained);

          if (leveledUp) {
            const levelMsg = `🎊 **LEVEL UP!** Selamat bang ${interaction.user.username}, lu sekarang **Level ${newLevel}**!`;
            if (interaction.replied || interaction.deferred) {
              await interaction.followUp({ content: levelMsg });
            } else {
              await interaction.reply({ content: levelMsg });
            }
          }
        } catch (xpError) {
          console.error("Error awarding command XP:", xpError);
        }
      } else if (interaction.isButton()) {
        const buttonEvent = client.buttonEvents.get(interaction.customId);
        if (buttonEvent) {
          // Jalanin event button kalo ada
          await buttonEvent.execute(interaction);
        }
      } else if (interaction.isModalSubmit()) {
        const modalEvent = client.modalEvents.get(interaction.customId);
        if (modalEvent) {
          await modalEvent.execute(interaction);
        }
      }
    } catch (error) {
      console.error(`Error executing interaction:`, error);
      if (interaction.isRepliable()) {
        try {
          const content = "There was an error while executing this command!";
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
          } else {
            await interaction.reply({ content, flags: MessageFlags.Ephemeral });
          }
        } catch (replyError) {
          console.error("Failed to send error message (interaction may have expired):", replyError);
        }
      }
    }
  },
} as ClientEvent;
