import { Command } from "../types";
import { MessageEmbed } from "discord.js";

export default {
  name: "qr",
  description: "Generates a qr code",
  example: "Hello World!",
  usage: "<text>",
  category: "Misc",
  run({ args, message }) {
    try {
      if (!args[0]) return message.channel.send("No text provided");
      const search = args.join(" ");

      const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        search
      )}`;

      message.reply({
        embeds: [new MessageEmbed().setImage(qr).setColor("DARK_BLUE")],
      });

      return;
    } catch {
      return message.reply({ content: "Couldn't build the qr code" });
    }
  },
} as Command;
