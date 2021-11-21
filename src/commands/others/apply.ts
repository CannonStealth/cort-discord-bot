import { MessageEmbed, User } from "discord.js";
import { Command } from "../../types";

const applyMap = new Map();

const options: {
  question: string;
  topic?: string;
  answer?: string;
  time?: number;
}[] = [
  {
    question: "What is your timezone? (If you don't know, state your Country)",
    topic: "Timezone / Country",
    time: 30,
  },
  {
    question: "How active are you in the server? (activity / day)",
    topic: "Activity / day",
    time: 30,
  },
  {
    question:
      "What made you want to be a moderator in my server? (Answer as fully as possible)",
    topic: "Reason to be a moderator",
    time: 120,
  },
  {
    question: "What will you achieve whilst being moderator? (Don't be vague)",
    topic: "What they will achieve while being a moderator",
    time: 120,
  },
  {
    question:
      "Someone sent an NSFW image / link to a chat and it bypassed our robot system. What do you do?",
    topic:
      "What would they do when someone sends a NSFW imagine or link in a chat",
    time: 50,
  },
  {
    question:
      "Someone is threatening another member of the server. What do you do?",
    topic: "What would they do when someone threats another member",
    time: 50,
  },
  {
    question: "Someone is abusing their moderator role. What do you do?",
    topic: "What would they do when someone abuses their moderator role",
    time: 50,
  },
  {
    question:
      "Somebody sent a Grabify / IP Logger link with intent to harm someone else. What do you do?",
    topic: "What would they do when somebody sends an IP grabber",
    time: 50,
  },
  {
    question:
      "Someone is trying to hack / phish / impersonate someone else. What do you do?",
    topic:
      "What would they do when somebody is trying to hack / phish / impersonate someone else",
    time: 50,
  },
  {
    question:
      "By agreeing here, you understand that we have the right to revoke your membership in this server.\nBy agreeing here, you agree to all of Discord's Rules and our rules in the server.\nReply with `yes` or `no`",
    answer: "yes",
    time: 20,
  },
];

export default {
  name: "apply",
  description: "Applies to Administrator",
  category: "Misc",
  async run({ args, message, client }) {
    const stats = await client.get("Mod");

    if (!stats?.mod)
      return message.channel.send("Mod apps are currently closed");
    if (
      message.member?.joinedTimestamp! + 1 * 30 * 24 * 60 * 60 * 1000 >
      Date.now()
    )
      return message.channel.send(
        "You haven't been here time enough to apply (30 days)"
      );

    const status = applyMap.get(message.author.id);
    if (status) return;

    applyMap.set(message.author.id, true);

    try {
      await message.member?.send(`Are you ready to start?\nReply with \`yes\``);
      const channel = await message.member?.createDM();
      const collector = await channel!.awaitMessages({
        max: 1,
        time: 20 * 1000,
        filter: (msg) => msg.author.id !== client.user!.id,
      });

      if (collector.first()?.content.toLowerCase() !== "yes") {
        applyMap.delete(message.author.id);
        return message.reply("Stopped");
      }
    } catch {
      applyMap.delete(message.author.id);
      return message.reply("Your dms are closed");
    }

    const embed = new MessageEmbed()
      .setAuthor(
        `${message.author.tag} Mod Application`,
        message.guild!.iconURL({ dynamic: true })!
      )
      .setColor("GREEN")
      .setFooter("Reply within 20 seconds");

    const modEmbed = new MessageEmbed()
      .setColor("GREEN")
      .setAuthor(
        `${message.author.tag} Mod Application`,
        message.author.displayAvatarURL({ dynamic: true })!
      )
      .setFooter(`User ID: ${message.author.id}`);

    const channel = await message.member?.createDM();
    if (!channel) {
      applyMap.delete(message.author.id);
      return message.channel.send("Your dms are closed");
    }

    for (const { question, topic, answer, time = 2 } of options) {
      embed.setTitle(question).setFooter(`Reply within ${time} seconds`);
      try {
        await channel.send({ embeds: [embed] });
        const awaiter = await channel.awaitMessages({
          max: 1,
          time: time * 1000,
          filter: (msg) => msg.author.id !== client.user!.id,
        });

        const response = awaiter.first()?.content;

        if (!response) {
          applyMap.delete(message.author.id);
          return channel.send("You didn't reply in time");
        }

        if (response.length < 3) {
            applyMap.delete(message.author.id);
            return channel.send("Cancelled, your answer was too small");
          }

        if (response.length > 400) {
          applyMap.delete(message.author.id);
          return channel.send("Cancelled, your answer was too big");
        }

        if (answer && response.toLowerCase() !== answer) {
          applyMap.delete(message.author.id);
          return channel.send("Cancelled, wrong answer");
        }

        if (topic) modEmbed.addField(topic, response, false);
      } catch {
        applyMap.delete(message.author.id);
        return message.reply("Something went wrong");
      }
    }

    channel.send("Done!")

    applyMap.delete(message.author.id);

    client.formsChannel.send({ embeds: [modEmbed] });

    return;
  },
} as Command;
