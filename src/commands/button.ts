import { Command } from "../types";
import {
  MessageButton,
  MessageActionRow,
  MessageComponentInteraction,
} from "discord.js";

export default {
  name: "button",
  aliases: ["but", "btn"],
  async run({ message }) {

    await message.delete()
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("a")
        .setLabel("Primary")
        .setStyle("PRIMARY")
    );

    const msg = await message.channel.send({ content: "heh", components: [row] });

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

    collector.on("end", async (i) => {
      msg.delete()
    })
  },
} as Command;
