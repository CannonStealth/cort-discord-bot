import { Command } from "../types";
import {
  MessageSelectMenu,
  MessageActionRow,
  MessageComponentInteraction,
  SelectMenuInteraction
} from "discord.js";

export default {
  name: "help",
  async run({ message }) {
    try {
      await message.delete();
      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .addOptions([
            {
              label: "Test",
              value: "Pog",
              description: "IDK",
            },

            {
                label: "shit",
                value: "fuck"
            }
          ])
          .setCustomId("help")
      );

      const msg = await message.channel.send({
        content: "heh",
        components: [row],
      });

      const filter = (i: MessageComponentInteraction) =>
        i.customId === "help" && i.user.id === message.author.id;

      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 60 * 1000,
      });

      collector.on("collect", async (i) => {
        if (i.isSelectMenu() && i.customId === "help") {
        console.log(i.values) // [ 'fuck' ]
        
          await i.update({ content: "Cool", components: [row] });
        }
      });

      collector.on("end", async (i) => {
          collector.stop()
        console.log("It ended");
      });
    } catch {
      return;
    }
  },
} as Command;
