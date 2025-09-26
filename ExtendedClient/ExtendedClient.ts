import { Client, Collection, GatewayIntentBits } from "discord.js";
import { ButtonEvent, ClientEvent, Command } from "../@types/type";

class ExtendedClient extends Client {
  public commands: Collection<string, Command>;
  public clientEvents: Collection<string, ClientEvent>;
  public buttonEvents: Collection<string, ButtonEvent>;

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds],
    });
    this.commands = new Collection();
    this.clientEvents = new Collection();
    this.buttonEvents = new Collection();
  }
}

export default ExtendedClient;
