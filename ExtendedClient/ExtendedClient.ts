import { Client, Collection, GatewayIntentBits } from "discord.js";
import { ButtonEvent, ClientEvent, Command, ModalEvent } from "../types/type";

class ExtendedClient extends Client {
  public commands: Collection<string, Command>;
  public clientEvents: Collection<string, ClientEvent>;
  public buttonEvents: Collection<string, ButtonEvent>;
  public modalEvents: Collection<string, ModalEvent>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ],
    });
    this.commands = new Collection();
    this.clientEvents = new Collection();
    this.buttonEvents = new Collection();
    this.modalEvents = new Collection();
  }
}

export default ExtendedClient;
