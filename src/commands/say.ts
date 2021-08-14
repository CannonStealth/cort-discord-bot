import { Command } from "../types"

export default {
    name: "say",
    aliases: ["talk"],
    async run({ args, message }) {
        // deleting message
        await message.delete()
        // sening message
        message.channel.send(args.join(" "))
    }
} as Command