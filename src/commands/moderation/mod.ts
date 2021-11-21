import { TextChannel, Snowflake } from "discord.js";
import { Command } from "../../types";

export default {
  name: "mod",
  category: "Moderation",
  description: "Opens/Closes mod apps",
  admin: true,
  async run({ args, message, client }) {
      const stats = await client.get("Mod")

      if (stats?.mod) {
          await client.remove("Mod")
          return message.channel.send("Closed mod apps")
      } else {
          await client.set("Mod", { 
              mod: true
          })

          return message.channel.send("Oppened mod apps")
      }

      return
  }
} as Command;
