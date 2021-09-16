import { PermissionResolvable, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../types";


export default {
  name: "mute",
  async run({ message, args, client }) {
      
    const member = message.mentions.members?.first()

    if (!member || !args[0]) return message.channel.send(`You didn't mention anyone`)

    if (!args[1]) return message.channel.send("You didn't provide any duration")
    const expiration = client.time(args.slice(1).join(" "))

    if (!expiration) return message.channel.send("Invalid expiration time;\nFormat example: **2d 12h 30m 20s**")

    await client.mute(member, expiration)

    message.channel.send(`Successfully muted <@${member.id}>`)
    client.report({ colour: "RED", description: `<@${member.id}> was muted by <@${message.author.id}>\nDuration: ${client.convert(expiration, 2)}`, })

    return
  },
} as Command;
