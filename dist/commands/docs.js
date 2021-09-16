"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const discord_js_1 = require("discord.js");
const reduce = (str, int) => str.length > int ? str.slice(int - 3) + "..." : str;
exports.default = {
    name: "docs",
    async run({ args, message }) {
        if (!args.length)
            return message.channel.send("Specify what you want to search");
        const res = await node_fetch_1.default(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.join(" "))}`);
        const data = await res.json();
        if (!data) {
            return message.reply("Could not find that!");
        }
        else {
            let embed = new discord_js_1.MessageEmbed().setAuthor("Discord.JS Documentaion", data.author?.iconURL, data.author?.url);
            if (data.title) {
                embed.setTitle(data.title);
            }
            if (data.description) {
                let desc = data.description.replace(/__/g, "");
                embed.setDescription(desc);
            }
            if (data.fields) {
                data.fields = data.fields.map(field => ({ value: reduce(field.value, 1024), name: field.name, inline: field.inline }));
                embed.addFields(data.fields);
            }
            return message.channel.send({ embeds: [embed] });
        }
    }
};
