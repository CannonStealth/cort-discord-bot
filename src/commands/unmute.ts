import { TextChannel, Snowflake } from "discord.js";
import { Command } from "../types";

export default {
  name: "unmute",
  async run({ args, message, client }) {
    if (!message.member?.permissions.has("ADMINISTRATOR"))
      return message.channel.send("You can't unmute a person");
    const user = message.mentions.members?.first();

    if (!user || !args[0])
      return message.channel.send("You didn't mention anyone");

    if (user.permissions.has("ADMINISTRATOR"))
      return message.channel.send("You can't unmute an admin");

    const reason = args.slice(1).join(" ") || "No reason specified"

    await client.unmute(user)
    message.channel.send(`Successfully unmuted <@${user.id}>`)

    client.report({
      colour: "GREEN",
      description: `<@${user.id}> was unmuted by <@${message.author.id}>\nReason: ${reason}`,
    });
    return;
  },
} as Command;
