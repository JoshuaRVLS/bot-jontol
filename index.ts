import "./config/setup"; // MUST BE FIRST
import {
  Events,
  REST,
  Routes,
  Collection,
} from "discord.js";
import { ButtonEvent, ClientEvent, Command, ModalEvent } from "./types/type";
import ExtendedClient from "./ExtendedClient/ExtendedClient";
import { config } from "./utils/env";
import { loadFiles } from "./utils/fileLoader";
import express from "express";

const client = new ExtendedClient();
const app = express();
const port = parseInt(process.env.BOT_API_PORT || "8000", 10);

app.use(express.json());

// Simple Security Middleware
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKeys = [config.OPENROUTER_KEY, "09071982"];
  if (!apiKey || !validKeys.includes(apiKey as string)) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  next();
});

// Global Stats Endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    uptime: client.uptime,
    guilds: client.guilds.cache.size,
    users: client.users.cache.size,
    readyTimestamp: client.readyTimestamp
  });
});

// Guild Live Data Endpoint
app.get('/api/guild/:guildId', (req, res) => {
  const guild = client.guilds.cache.get(req.params.guildId);
  if (!guild) return res.status(404).json({ error: "Guild not found" });

  const channels = guild.channels.cache
    .filter(c => c.type === 0) // Text channels
    .map(c => ({ id: c.id, name: c.name }));

  res.json({
    id: guild.id,
    name: guild.name,
    memberCount: guild.memberCount,
    onlineMembers: guild.members.cache.filter(m => m.presence?.status === 'online').size,
    channels: channels,
  });
});

app.listen(port, () => {
  console.log(`[API] Bot Bridge API is running on http://localhost:${port}`);

  // Start Market Simulation
  import("./utils/StockMarket").then(m => m.startMarketSimulation());
});

(async () => {
  const commandFiles = await loadFiles("commands");
  const clientEventFiles = await loadFiles("handlers/events");
  const buttonEventFiles = await loadFiles("handlers/buttons");

  client.commands = new Collection<string, Command>();
  client.clientEvents = new Collection<string, ClientEvent>();
  client.buttonEvents = new Collection<string, ButtonEvent>();
  client.modalEvents = new Collection<string, ModalEvent>();

  for (const file of commandFiles) {
    try {
      const commandModule = await import(`./commands/${file}`);
      const command: Command = commandModule.default;

      if (
        command &&
        command.type === "command" &&
        command.data?.name &&
        command.data?.description
      ) {
        client.commands.set(command.data.name, command);
      } else {
        console.warn(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
      }
    } catch (error) {
      console.error(`[ERROR] Error loading command ${file}:`, error);
    }
  }

  for (const file of clientEventFiles) {
    try {
      const eventModule = await import(`./handlers/events/${file}`);
      const event: ClientEvent = eventModule.default;

      if (event && event.type === "event" && event.name) {
        client.clientEvents.set(event.name, event);
      }
    } catch (error) {
      console.error(`[ERROR] Error loading event ${file}:`, error);
    }
  }

  for (const file of buttonEventFiles) {
    try {
      const buttonModule = await import(`./handlers/buttons/${file}`);
      const buttonEvent: ButtonEvent = buttonModule.default;

      if (buttonEvent && buttonEvent.type === "button" && buttonEvent.id) {
        client.buttonEvents.set(buttonEvent.id, buttonEvent);
      }
    } catch (error) {
      console.error(`[ERROR] Error loading button event ${file}:`, error);
    }
  }

  const modalFiles = await loadFiles("handlers/modals");
  for (const file of modalFiles) {
    try {
      const modalModule = await import(`./handlers/modals/${file}`);
      const modalEvent: ModalEvent = modalModule.default;

      if (modalEvent && modalEvent.type === "modal" && modalEvent.id) {
        client.modalEvents.set(modalEvent.id, modalEvent);
      }
    } catch (error) {
      console.error(`[ERROR] Error loading modal event ${file}:`, error);
    }
  }

  const rest = new REST({ version: "10" }).setToken(config.TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
      {
        body: client.commands.map((command) => command.data.toJSON()),
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }

  // console.table calls removed for cleaner output
  console.log(`Loaded ${client.commands.size} commands.`);
  console.log(`Loaded ${client.clientEvents.size} events.`);
  console.log(`Loaded ${client.buttonEvents.size} buttons.`);

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

  await client.login(config.TOKEN);
})();
