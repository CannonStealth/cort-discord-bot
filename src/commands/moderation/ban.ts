import { Command } from "../../types";

export default {
  name: "ban",
  category: "Moderation",
  usage: "<@user | id> [reason]",
  description: "Bans someone",
  example: "@Rubidium racist",
  admin: true,
  async run({
    args: [args, ...reason],
    message,
    client
  }) {


      const member = await client.getMember("MEMBER", message, args)

      if (!member) return message.channel.send("You didn't mention anyone to ban")

      if (!member.bannable) return message.channel.send("I can't ban that member")

      try {
        await member.ban(reason ? { reason: reason.join(" "), days: 7 } : { days: 7 })
        message.react("✅")

        client.report({
          colour: "RED",
          description: `<@${member.id}> was banned by <@${message.author.id}>\nReason: ${reason.length ? reason.join(" ") : "No reason specified"}`,
        });
      } catch {
        message.react("❌")
      }

    return
  },
} as Command;
