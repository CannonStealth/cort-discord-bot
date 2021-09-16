"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "help",
    category: "Information",
    async run({ message, client: { helpMenu, categories } }) {
        try {
            if (!arguments.length) {
                const embed = new discord_js_1.MessageEmbed()
                    .setDescription(`React to get information about a category`);
            }
        }
        catch {
            return;
        }
    },
};
