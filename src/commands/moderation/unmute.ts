import { TextChannel, Snowflake } from "discord.js";
import { Command } from "../../types";

export default {
  name: "unmute",
  usage: "<@user> [reason]",
  category: "Moderation",
  description: "Unmutes someone",
  example: "@Rubidium not racist anymore",
  admin: true,
  async run({ args, message, client }) {
    try {

    const user = await client.getMember("MEMBER", message, args[0])

    if (!user)
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
  } catch {
    return message.channel.send("Couldn't unmute that user")
  }
  },
} as Command;
