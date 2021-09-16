"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "ban",
    category: "Moderation",
    usage: "<@user | id> [reason]",
    description: "Bans someone",
    example: "@Rubidium racist",
    async run({ args: [args, ...reason], message, client }) {
        if (!message.member?.permissions.has("BAN_MEMBERS"))
            return message.channel.send("You can't ban members");
        if (!args)
            return message.channel.send("You didn't provide any user to ban");
        try {
            const user = message.mentions.users.first() || (await client.users.fetch(args));
            try {
                await message.guild?.members.ban(user, reason.length
                    ? {
                        reason: reason.join(" "),
                    }
                    : undefined);
                client.report({
                    colour: "RED",
                    description: `<@${user.id}> was banned by <@${message.author.id}>\nReason: ${reason.length ? reason.join(" ") : "No reason specified"}`,
                });
                message.channel.send("Successfully banned them!");
                return;
            }
            catch {
                message.channel.send("Couldn't ban this user");
                return;
            }
        }
        catch {
            message.channel.send("You didn't provide any user to ban");
            return;
        }
        return;
    },
};
