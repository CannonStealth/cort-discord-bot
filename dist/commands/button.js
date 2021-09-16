"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "button",
    aliases: ["but", "btn"],
    async run({ message }) {
        await message.delete();
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setCustomId("a")
            .setLabel("Primary")
            .setStyle("PRIMARY"));
        const msg = await message.channel.send({ content: "heh", components: [row] });
        const filter = (i) => i.customId === "a" && i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({
            filter,
            time: 15000,
        });
        row.components[0].setDisabled(true);
        collector.on("collect", async (i) => {
            if (i.customId === "a") {
                await i.update({ content: "A button was clicked!", components: [row] });
            }
        });
        collector.on("end", async (i) => {
            msg.delete();
        });
    },
};
