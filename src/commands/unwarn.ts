import { TextChannel, Snowflake } from "discord.js";
import { Command } from "../types";

export default {
  name: "unwarn",
  aliases: ["pardon"],
  async run({ args, message, client }) {
    if (!message.member?.permissions.has("ADMINISTRATOR"))
      return message.channel.send("You can't unwarn a person");
    const user = message.mentions.members?.first();

    if (!user || !args[0])
      return message.channel.send("You didn't mention anyone");

    if (user.permissions.has("ADMINISTRATOR"))
      return message.channel.send("You can't unwarn an admin");

    if (isNaN(+args[1])) return message.channel.send("Invalid warn number");

    const i = +args[1] - 1;


    const schema = await client.getWarn(user.id)

    if(!schema || !schema.warns?.length) return message.channel.send("This user doesn't have any warnings")

    if (!schema.warns[i])
      return message.channel.send("That warn does not exist");
    const reason = args[2] ? args.slice(2).join(" ") : "No reason specified";

    schema.warns.splice(i, 1);

    await schema.save();

    message.channel.send(`Removed warn **${args[1]}** from <@${user.id}>`);

    client.report({
      colour: "GREEN",
      description: `<@${user.id}> was unwarned by <@${message.author.id}>\nReason: ${reason}`,
    });
    return;
  },
} as Command;
