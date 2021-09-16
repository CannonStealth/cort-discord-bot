"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "warn",
    aliases: ["punish"],
    async run({ args, message, client }) {
        if (!message.member?.permissions.has("ADMINISTRATOR"))
            return message.channel.send("You can't warn a person");
        const user = message.mentions.members?.first();
        if (!user || !args[0])
            return message.channel.send("You didn't mention anyone");
        if (user.permissions.has("ADMINISTRATOR"))
            return message.channel.send("You can't warn an admin");
        await message.channel.send(`Successfully warned <@${user.id}>`);
        await client.warn(user, args[1] ? args.slice(1).join(" ") : undefined, message.channel, message.author);
        return;
    }
};
