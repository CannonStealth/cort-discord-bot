"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "kick",
    usage: "<@user | id> [reason]",
    category: "Moderation",
    description: "Kicks someone",
    example: "@Rubidium racist",
    async run({ args: [args, ...reason], message, client }) {
        if (!message.member?.permissions.has("KICK_MEMBERS"))
            return message.channel.send("You can't kick members");
        if (!args)
            return message.channel.send("You didn't provide any user to kick");
        try {
            const user = message.mentions.users.first() || (await client.users.fetch(args));
            try {
                await message.guild?.members.kick(user, reason.length ? reason.join(" ") : undefined);
                client.report({
                    colour: "RED",
                    description: `<@${user.id}> was kicked by <@${message.author.id}>\nReason: ${reason.length ? reason.join(" ") : "No reason specified"}`,
                });
                return;
                message.channel.send("Successfully kicked them!");
                return;
            }
            catch {
                message.channel.send("Couldn't kick this user");
                return;
            }
        }
        catch {
            message.channel.send("You didn't provide any user to kick");
            return;
        }
    },
};
