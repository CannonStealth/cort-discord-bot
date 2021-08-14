import { Slash } from "../types";

// exporting the command
export default {
    name: "say",
    stop: true,
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

        // replying the message
        interaction.reply((interaction.options.getString("message")! || "Hmm empty message?")) 
    }
} as Slash