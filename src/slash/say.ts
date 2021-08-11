import { Slash } from "../types";

export default {
    name: "say",
    description: "Makes the bot repeat something",
    options: [
        {
            required: true,
            name: "message",
            type: "STRING",
            description: "The message which will the bot repeat",
        }
    ],
    run({ interaction }) {
        interaction.reply((interaction.options.getString("message")! || "Hmm empty message?")) 
    }
} as Slash