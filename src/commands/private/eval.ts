import { Command } from "../../types";
import { MessageEmbed } from "discord.js"

const x = "```"
const resume = (text: string, int: number) => text.length > int ? text.substring(0, int) + "..." : text

export default {
  name: "private",
  aliases: ["eval", "priv", "e"],
  async run({ message, client, args }) {

    if (message.author.id !== "811657485462274129") return message.channel.send("You can't use this command")
    if (!args.length) return message.channel.send("What do you expect me to eval???")

        let embed_sent_by_client = new MessageEmbed()
        .setTitle('Processing...')
        .setColor('ORANGE')

        const message_sent_by_client = await message.channel.send({ embeds: [embed_sent_by_client] })

        try {

        const toEval = args.join(" ").replaceAll("```", '')
        const evaled = eval(toEval)

        const embed = new MessageEmbed()
        .addField('To eval:', x + "js\n" + toEval + x, false)
        .addField('\\📤 Output:', x + resume(evaled, 750) + x, false)
        .addField('Type', x + typeof evaled + x, false)
        .setColor('#000dff');

        message_sent_by_client.edit({ embeds: [embed] })

    } catch (err) {
        const errEmbed = new MessageEmbed()
        .setTitle('Error')
        .addField('\\📤 Output:', x + resume(err as string, 750) + x, false)
        .setColor('RED');

        return message_sent_by_client.edit({ embeds: [errEmbed] })

    }
    return
  },
} as Command;
