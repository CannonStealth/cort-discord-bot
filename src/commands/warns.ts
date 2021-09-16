import { MessageEmbed } from "discord.js"
import { Command } from "../types"

export default {
    name: "warns",
    async run({ args, message, client }) {
        const user = message.mentions.users.first()

        if (!user) return message.channel.send("You didn't mention any user")

        const warns = await client.getWarn(user.id)


        if (!warns || !warns.warns?.length) return message.channel.send("This user doesn't have any warn")

        const embed = new MessageEmbed()
        .setColor("GREEN")
        let str = ""
        warns.warns.forEach(({ author, reason, time }, index) => {

            str += `**${index + 1}.** by <@${author}> | Reason: ${reason} | Expires in ${client.convert(time - Date.now())}\n`
        })



        embed.setDescription(str)

        message.channel.send({ embeds: [embed] })

        return
    }
} as Command