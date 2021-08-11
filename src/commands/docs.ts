import axios from "axios";
import { Command } from "../types";
import { MessageEmbed } from "discord.js";

const reduce = (str: string, int: number) => str.length > int ? str.slice(int - 3) + "..." : str
export default {
  name: "docs",
  run({ args, message }) {
      try {
    const uri = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
      args.join(" ")
    )}`;

    axios.get(uri)
      .then(({ data }: any) => {
        if (data && !data.error) {

            (data as MessageEmbed).fields.map((val) => val.value = reduce(val.value, 1024))
          message.channel.send({ embeds: [data as MessageEmbed] }).catch(() => undefined)
        } else {
          message.reply("Cannot find the documentation you are looking for");
        }
      })
      .catch(() => undefined);
    } catch {
        return;
    }
  },
} as Command;
