import { Command } from "../types"

export default {
    name: "say",
    aliases: ["talk"],
    async run({ args, message }) {
        await message.delete()
        message.channel.send(args.join(" "))
    }
} as Command