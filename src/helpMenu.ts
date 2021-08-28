import Client from "./Client";
import {
  MessageSelectMenu,
  MessageActionRow,
  MessageComponentInteraction,
  SelectMenuInteraction,
} from "discord.js";

export default (client: Client) => {
  const menu = new MessageSelectMenu()
  client.categories.forEach((c) => menu.addOptions([{
      label: c[0].toLowerCase().replace(/\b[a-zA-Z]/g, m => m.toUpperCase()),
      value: command(c, client)
  }]))
};

function command(c: string[], client: Client) {

    let msg = "";
    for (const command of c) {

        const description = client.commands.get(command.toLowerCase())?.description || "No description"
        msg += `**${client.prefix + command.toLowerCase()}** - ${description}\n`

    }

    return msg;
}