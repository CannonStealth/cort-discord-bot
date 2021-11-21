import { Command } from "../../types";

export default {
  name: "kick",
  usage: "<@user | id> [reason]",
  category: "Moderation",
  description: "Kicks someone",
  example: "@Rubidium racist",
  admin: true,
  async run({ args: [args, ...reason], message, client }) {


      const member = await client.getMember("MEMBER", message, args)

      if (!member) return message.channel.send("You didn't mention anyone to kick")

      if (!member.kickable) return message.channel.send("I can't kick that member")

      try {
        await member.kick(reason ? reason.join(" ") : undefined)

        client.report({
          colour: "RED",
          description: `<@${member.id}> was kicked by <@${message.author.id}>\nReason: ${reason.length ? reason.join(" ") : "No reason specified"}`,
        });
      } catch {
        message.react("❌")
      }

    return
  },
} as Command;
