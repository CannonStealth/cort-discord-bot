import { Command } from "../types";
import {
  MessageButton,
  MessageActionRow,
  MessageComponentInteraction,
} from "discord.js";

export default {
  name: "button",
  aliases: ["but", "btn"],
  async run({ args, message }) {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("a")
        .setLabel("Primary")
        .setStyle("PRIMARY")
    );

    message.channel.send({ content: "heh", components: [row] });

    const filter = (i: MessageComponentInteraction) =>
      i.customId === "a" && i.user.id === message.author.id;

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    row.components[0].setDisabled(true);

    collector.on("collect", async (i) => {
      if (i.customId === "a") {
        await i.update({ content: "A button was clicked!", components: [row] });
      }
    });
  },
} as Command;
