import fetch from "node-fetch";
import { Command } from "../types";
import { MessageEmbed } from "discord.js";

const reduce = (str: string, int: number) => str.length > int ? str.slice(int - 3) + "..." : str
export default {
  name: "docs",
  async run({ args, message }) {

    if (!args.length) return message.channel.send("Specify what you want to search")

    const res = await fetch(
        `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
          args.join(" ")
        )}`
      );
      const data: MessageEmbed = await res.json();
      if (!data) {
        return message.reply("Could not find that!");
      } else {
        let embed = new MessageEmbed().setAuthor(
          "Discord.JS Documentaion",
        data.author?.iconURL,
          data.author?.url
        );
        if (data.title) {
          embed.setTitle(data.title);
        }
        if (data.description) {
          let desc = data.description.replace(/__/g, "");
          embed.setDescription(desc)
        }
        if (data.fields) {
            data.fields = data.fields.map(field => ({ value: reduce(field.value, 1024), name: field.name, inline: field.inline }))
          embed.addFields(data.fields);
        }
        return message.channel.send({ embeds: [embed] });
      }
    }
} as Command;
