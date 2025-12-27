import {
    ClientEvents,
    Interaction,
    SlashCommandBuilder,
} from "discord.js";

export type Type = "command" | "button" | "event" | "modal";

export interface Command {
    type: Type;
    data: SlashCommandBuilder;
    execute: (interaction: Interaction) => Promise<void>;
}

export interface ButtonEvent {
    type: Type;
    authorOnly: boolean;
    id: string;
    execute: (interaction: Interaction) => Promise<void>;
}

export interface ModalEvent {
    type: "modal";
    id: string;
    execute: (interaction: Interaction) => Promise<void>;
}

export interface ClientEvent<T extends keyof ClientEvents = keyof ClientEvents> {
    once: boolean;
    type: Type;
    name: T;
    execute: (...args: any) => Promise<void>;
}
