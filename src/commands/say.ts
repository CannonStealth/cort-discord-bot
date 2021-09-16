import { Command } from "../types"

export default {
    name: "say",
    aliases: ["talk"],
    usage: "<message>",
    description: "Makes the bot talk",
    category: "Misc",
    example: "Hello",
    async run({ args, message }) {
        // deleting message
        await message.delete()
        // sening message
        message.channel.send(args.join(" "))
    }
} as Command