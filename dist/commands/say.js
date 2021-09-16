"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "say",
    aliases: ["talk"],
    async run({ args, message }) {
        // deleting message
        await message.delete();
        // sening message
        message.channel.send(args.join(" "));
    }
};
