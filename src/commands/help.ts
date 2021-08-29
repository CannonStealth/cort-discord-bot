import { Command } from "../types";
import {
  MessageSelectMenu,
  MessageActionRow,
  MessageComponentInteraction,
  SelectMenuInteraction,
  MessageEmbed,
} from "discord.js";

export default {
  name: "help",
  category: "Information",
  async run({ message, client: { helpMenu, categories } }) {
    try {
      if (!arguments.length) {
        const embed = new MessageEmbed()
        .setDescription(`React to get information about a category`);
        
      }
    } catch {
      return;
    }
  },
} as Command;
