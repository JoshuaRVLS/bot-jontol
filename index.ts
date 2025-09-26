import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  Collection,
} from "discord.js";
import dotenv from "dotenv";
import fs from "fs/promises";
import { ButtonEvent, ClientEvent, Command } from "./@types/type";
import ExtendedClient from "./ExtendedClient/ExtendedClient";

dotenv.config();

const client = new ExtendedClient();

(async () => {
  const commandFiles = (
    await fs.readdir("commands", { recursive: true })
  ).filter(
    (file) =>
      file.endsWith(".js") || file.endsWith(".ts") || file.endsWith(".mjs")
  );
  const clientEventFiles = (
    await fs.readdir("handlers/events", { recursive: true })
  ).filter(
    (file) =>
      file.endsWith(".js") || file.endsWith(".ts") || file.endsWith(".mjs")
  );
  const buttonEventFiles = (
    await fs.readdir("handlers/buttons", { recursive: true })
  ).filter(
    (file) =>
      file.endsWith(".js") || file.endsWith(".ts") || file.endsWith(".mjs")
  );

  client.commands = new Collection<string, Command>();
  client.clientEvents = new Collection<string, ClientEvent>();
  client.buttonEvents = new Collection<string, ButtonEvent>();

  for (let file of commandFiles) {
    try {
      const command: Command = (await import(`./commands/${file}`)).default;
      if (
        command.type === "command" &&
        command.data.name &&
        command.data.description
      ) {
        client.commands.set(command.data.name, command);
      }
    } catch (error) {
      console.log(error);
    }
  }

  for (let file of clientEventFiles) {
    try {
      const event: ClientEvent = (await import(`./handlers/events/${file}`))
        .default;

      if (event.type === "event" && event.name) {
        client.clientEvents.set(event.name, event);
      }
    } catch (error) {
      console.log(error);
    }
  }

  for (let file of buttonEventFiles) {
    try {
      const buttonEvent: ButtonEvent = (
        await import(`./handlers/buttons/${file}`)
      ).default;

      if (buttonEvent.type === "button" && buttonEvent.id) {
        client.buttonEvents.set(buttonEvent.id, buttonEvent);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const rest = new REST({ version: "10" }).setToken(
    process.env.TOKEN as string
  );

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID as string,
        process.env.GUILD_ID as string
      ),
      {
        body: client.commands.map((command) => command.data.toJSON()),
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }

  console.table(client.commands);
  console.table(client.clientEvents);
  console.table(client.buttonEvents);

  client.clientEvents.forEach((event) => {
    if (event.once) {
      client.once(event.name, (...args) => {
        event.execute(...args, client);
      });
    } else {
      client.on(event.name, (...args) => {
        event.execute(...args, client);
      });
    }
  });
  await client.login(process.env.TOKEN);
})();
