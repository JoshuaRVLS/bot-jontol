import {
  ClientEvents,
  Events,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";

type Type = "command" | "button" | "event";

interface Command {
  type: Type;
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => Promise<void>;
}

interface ButtonEvent {
  type: Type;
  authorOnly: boolean;
  id: string;
  execute: (interaction: Interaction) => Promise<void>;
}

interface ClientEvent<T extends keyof ClientEvents = keyof ClientEvents> {
  once: boolean;
  type: Type;
  name: T;
  execute: (...args: any) => Promise<void>;
}
