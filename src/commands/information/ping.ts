import { Command } from "../../types";
import { MessageEmbed } from "discord.js";

const x = "`";
const embed = new MessageEmbed()
.setColor('BLUE')
.setTitle("Pong \\🏓");

export default {
  name: "ping",
  category: "Information",
  description: "Shows my ping",
  async run({ message, client }) {
    const msg = await message.channel.send("Ping?");

    embed.setDescription(`**My Ping**: ${x}${
      msg.createdTimestamp - message.createdTimestamp
    }ms${x}
        **Api Ping**: ${x}${Math.round(client.ws.ping)}ms${x}
        **Uptime**: ${x}${client.convert(client.uptime!)}${x}`);
    msg.edit({ content: "Pong! 🏓", embeds: [embed] });
  },
} as Command;
