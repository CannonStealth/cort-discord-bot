import { Command } from "../../types"

export default {
    name: "afk",
    description: "Sets your afk status",
    category: "Misc",
    async run({ args, message, client }) {

        try {

        const msg = await message.channel.send("Setting your afk status")

        const reason = args.join(" ")

        if (reason.length >= 60) return message.channel.send("Reason can't be that long")
        
        const status = await client.get(`AFK/${message.author.id}`)

        if (status && status.on) return;

        await client.set(`AFK/${message.author.id}`, {
            on: true,
            reason,
            time: message.createdTimestamp || Date.now()
        })

        msg.edit(`You are now AFK${reason ? ` - ${reason}` : ""}.`)

        return

    } catch {
        return message.channel.send("Couldn't set your afk status")
    }
    }
} as Command