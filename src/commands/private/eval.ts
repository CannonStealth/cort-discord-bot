import { Command } from "../../types";

export default {
  name: "private",
  aliases: ["eval", "priv", "e"],
  async run({ message, client, args }) {

    
    try {
        if (message.author.id !== "811657485462274129") return message.channel.send("You don't use this command")
      if (!args.length) return message.channel.send("No args")   
      
      eval(args.join(" "))
    } catch (e) {
        console.log(e)
      return message.channel.send("Error");
    }

    return
  },
} as Command;
