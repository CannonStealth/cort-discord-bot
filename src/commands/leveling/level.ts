import { Command } from "../../types";

export default {
  name: "level",
  usage: "[@user]",
  example: "@Baklava",
  category: "Leveling",
  aliases: ["rank"],
  async run({ message, client, args }) {
    const member = message.mentions.members?.first() || message.member!;
    const level = await client.get(`Levels/${member.id}`);

    if (!level?.level && level?.level !== 0) return message.channel.send("The level is too low");


    message.channel.send(`**Level**: ${level.level}\n**XP**: ${level.xp || 0}/${level.level * 500}`)
    return;
  },
} as Command;
