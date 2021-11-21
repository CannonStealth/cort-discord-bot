import { TextChannel } from "discord.js"
import { Command } from "../../types"

export default {
    name: "warn",
    aliases: ["punish"],
    category: "Moderation",
    usage: "<@user | id> [reason]",
    description: "Warns someone",
    example: "@Rubidium racist",
    admin: true,
    async run({ args, message, client }) {

        const user = await client.getMember("MEMBER", message, args[0])

        if (!user) return message.channel.send("You didn't mention anyone")

        if (user.permissions.has("ADMINISTRATOR")) return message.channel.send("You can't warn an admin")


        await message.channel.send(`Successfully warned <@${user.id}>`)
        await client.warn(user, args[1] ? args.slice(1).join(" ") : undefined, message.channel as TextChannel, message.author)

        return

    }
} as Command