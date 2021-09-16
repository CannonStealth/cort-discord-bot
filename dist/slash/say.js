"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// exporting the command
exports.default = {
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
        interaction.reply((interaction.options.getString("message") || "Hmm empty message?"));
    }
};
