"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const Clash_1 = __importDefault(require("./Clash"));
const firebase_json_1 = __importDefault(require("./firebase.json"));
const dotenv_1 = require("dotenv");
const firebase_1 = __importDefault(require("firebase"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.config({ path: "src/.env" }); // Accessing .env file
class Client extends discord_js_1.Client {
    // types
    constructor(options) {
        super(options);
        this.prefix = "-";
        this.commands = new discord_js_1.Collection();
        this.categories = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.slashCommands = new discord_js_1.Collection();
        this.clashRoyale = new Clash_1.default(process.env.CLASH_TOKEN);
        this.helpMenu = undefined;
        this.day = 86400000;
        this.warnExpirationTime = this.day * 2;
        this.clientToken = process.env.TOKEN;
        this.mongoPath = process.env.MONGO;
        this.dir = require.main?.path;
        this.spam = new Map();
        this.warnings = mongoose_1.default.model("warns", new mongoose_1.default.Schema({
            _id: {
                type: String,
                required: true,
            },
            warns: {
                type: [Object],
                default: null,
            },
        }));
        firebase_1.default.initializeApp(firebase_json_1.default);
        this.database = firebase_1.default.database();
        firebase_1.default.auth().signInAnonymously();
        mongoose_1.default
            .connect(this.mongoPath, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            keepAlive: true,
        })
            .then(() => console.log(`Connected to MongoDB`))
            .catch(console.error);
        // Message event
        this.on("messageCreate", async (message) => {
            if (message.author.bot || message.channel.type === "DM")
                return;
            if (message.content.toLowerCase().includes("nigga") ||
                message.content.toLowerCase().includes("nigger")) {
                await message.delete();
                message.channel.send(`<@${message.author.id}> you got 1 warn for saying the n word`);
                await this.warn(message.member, "Said the n word", message.channel);
            }
            const url = this.hasURL(message.content);
            if (url && url.length && !url[0].includes("https://tenor.com/view") && !url[0].includes("https://link.clashroyale.com")) {
                if ((url.includes("https://vm.tiktok/") ||
                    /(discord\.(gg|io|me|li)|discordapp\.com\/invite)/i.test(message.content) || url.includes("https://www.youtube.com/")) &&
                    message.channel.id !== "864588389550129152") {
                    await message.delete();
                    message.channel.send(`<@${message.author.id}> you got 1 warn for advertising\nIf you want to share a tiktok video or a discord invite share in <#864588389550129152>, your warn will be removed in 2 days`);
                    await this.warn(message.member, `Was advertising (${url[0]})`, message.channel);
                }
                else {
                    await message.delete();
                    message.channel.send(`<@${message.author.id}> you got 1 warn for sending suspicious links\nIf the link isn't malicious, tell an admin to remove your warn.`);
                    await this.warn(message.member, `Sent suspicious links (${url[0]})`, message.channel);
                }
            }
            if (message.channel.id === "887076630198091796" &&
                (message.attachments.first() || this.hasURL(message.content))) {
                ["✅", "❌"].forEach(async (e) => {
                    await message.react(e);
                });
            }
            const time = 4000;
            const limit = 3;
            if (this.spam.has(message.author.id)) {
                const data = this.spam.get(message.author.id);
                if (!data.stop) {
                    if (message.createdTimestamp - data.time < time) {
                        if (data.infractions > limit) {
                            message.channel.send(`You received 1 warn for **SPAMMING**\nYou have 5 seconds to stop`);
                            this.warn(message.member, "spamming", message.channel);
                            data.stop = true;
                        }
                        else {
                            data.infractions++;
                        }
                    }
                    else {
                        this.spam.delete(message.author.id);
                    }
                }
                else if (!data.stopped) {
                    data.stopped = true;
                    setTimeout(() => this.spam.delete(message.author.id), 5000);
                }
            }
            else {
                this.spam.set(message.author.id, {
                    infractions: 1,
                    time: message.createdTimestamp,
                });
            }
        });
        this.on("guildMemberAdd", (member) => {
            this.welcomeChannel.send(`**Welcome** <@${member.id}> to **${member.guild.name}** server!`);
            if (member.user.bot)
                member.roles.add("864586947115352064");
        });
        this.on("guildMemberRemove", ({ displayName }) => {
            this.welcomeChannel.send(`${displayName} just left the server :(`);
        });
        this.on("messageCreate", async (message) => {
            const { prefix } = this;
            if (!message.content.startsWith(prefix))
                return;
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmdName = args.shift();
            if (!message.content.startsWith(`${prefix.toLowerCase()}${cmdName?.toLowerCase()}`))
                return;
            const cmd = this.commands.get(cmdName.toLowerCase()) ||
                this.commands.get(this.aliases.get(cmdName.toLowerCase())); // Get command
            if (!cmd)
                return;
            cmd.run({ client: this, args, message }); // run it
            return;
        });
        // interaction event
        this.on("interactionCreate", async (interaction) => {
            if (!interaction.inGuild() && interaction.isCommand()) {
                return interaction.reply("Try using slash commands in a guild!");
            }
            const user = interaction.user;
            const member = await interaction.guild.members.fetch(user.id);
            const guild = interaction.guild;
            if (interaction.isCommand()) {
                let cmd = this.slashCommands.get(interaction.commandName); // get command
                if (!cmd)
                    return;
                cmd.run({ client: this, interaction, member, guild, user }); // execute it
                return;
            }
            return;
        });
    }
    async loader(dir, callback) {
        const files = await promises_1.readdir(path_1.join(this.dir, dir)); // get every files and folders
        for (const file of files) {
            const stat = await promises_1.lstat(path_1.join(this.dir, dir, file));
            if (stat.isDirectory()) {
                this.loader(path_1.join(dir, file), callback);
                continue;
            }
            // checking if it's a directory
            else if (!file.endsWith(".js") &&
                (!file.endsWith(".ts") || file.endsWith(".d.ts")))
                continue;
            const command = (await Promise.resolve().then(() => __importStar(require(path_1.join(this.dir, dir, file))))).default;
            if (callback)
                callback(command); // invoking the callback
        }
    }
    async Commands(dir, callback) {
        this.loader(dir, (command) => {
            // loading files
            this.commands.set(command.name.toLowerCase(), command); // setting the command
            callback(command);
            if (command.aliases?.length)
                for (const alias of command.aliases)
                    this.aliases.set(alias, command.name); // setting aliases
            if (command.category) {
                let category = command.category;
                let categoryGetter = this.categories.get(category.toLowerCase());
                if (!categoryGetter)
                    categoryGetter = [category];
                categoryGetter.push(command.name);
                this.categories.set(category.toLowerCase(), categoryGetter);
                // setting categories
            }
        });
        return this;
    }
    async SlashCommands(dir, callback) {
        const application = this.application;
        this.loader(dir, (file) => {
            // loading
            this.slashCommands.set(file.name, file); // setting slash commands
            if (!file.stop) {
                const toSend = {
                    name: file.name,
                    description: file.description,
                    defaultPermission: file.default,
                    options: file.options,
                }; // what we'll send to the api
                if (file.guilds && file.guilds.length) {
                    for (const guild of file.guilds) {
                        application.commands
                            .create(toSend, guild) // creating
                            .then(() => callback(file));
                    }
                }
                else {
                    application.commands.create(toSend).then(() => callback(file)); // creating the slash command
                }
            }
        });
        return this;
    }
    hasURL(url) {
        return url.match(/https?:\/\/((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?/i);
    }
    async warn(user, reason, channel, author = this.user) {
        const { id } = user;
        if (!reason)
            reason = "No reason specified";
        const amount = (await this.warnings.findByIdAndUpdate(user.id, {
            $push: {
                warns: {
                    author: author.id,
                    time: Date.now() + this.warnExpirationTime,
                    reason,
                },
            },
        }, { upsert: true, new: true })).warns?.length || 1;
        this.report({
            colour: "RED",
            description: `<@${id}> was warned${author ? ` by <@${author.id}>` : ""}\nReason: ${reason}`,
        });
        try {
            if (amount === 2) {
                await this.mute(user, this.day);
                channel.send(`<@${user.id}> got **muted** for 1 day!`);
                this.report({
                    colour: "RED",
                    description: `<@${id}> was auto-muted\nReason: ${reason}`,
                });
            }
            if (amount >= 3) {
                channel.send(`<@${user.id}> is now **BANNED**!`);
                await user.guild.members.ban(user.id);
                this.report({
                    colour: "RED",
                    description: `<@${id}> was auto-banned\nReason: ${reason}`,
                });
            }
        }
        catch {
            return;
        }
    }
    async get(path) {
        return (await this.database.ref(path).once("value")).val();
    }
    async set(path, value) {
        return this.database.ref(path).set(value);
    }
    async update(path, value) {
        return this.database.ref(path).update(value);
    }
    async remove(path) {
        return this.database.ref(path).remove();
    }
    async checkMutesAndWarns(guild) {
        (async () => {
            const mute = await this.get(`mutes`);
            if (!mute)
                return;
            const mutes = Object.entries(mute).map(([id, time]) => ({ id, ...time }));
            if (!mutes.length)
                return;
            for (const { id, time } of mutes) {
                if (time < Date.now()) {
                    try {
                        const member = await guild.members.fetch(id);
                        await this.unmute(member);
                        this.report({
                            colour: "YELLOW",
                            description: `<@${id}> was auto-unmuted\nReason: mute timeout expired`,
                        });
                    }
                    catch {
                        continue;
                    }
                }
                else
                    continue;
            }
        })();
        (async () => {
            const warnings = await this.getWarns();
            if (!warnings)
                return;
            for (const warn of warnings) {
                if (!warn.warns || !warn.warns.length) {
                    await this.warnings.findByIdAndDelete(warn._id);
                    continue;
                }
                for (const thisWarn of warn.warns) {
                    if (thisWarn.time <= Date.now()) {
                        await this.unwarn(warn._id, thisWarn);
                        this.report({
                            colour: "YELLOW",
                            description: `<@${warn._id}> was auto-unwarned\nReason: warn timeout expired`,
                        });
                    }
                    else
                        continue;
                }
            }
        })();
    }
    async unwarn(id, warn, reason = "No reason specified") {
        await this.warnings.findByIdAndUpdate(id, {
            $pull: {
                warns: warn,
            },
        });
        this.report({
            colour: "YELLOW",
            description: `<@${id}> was auto-unwarned\nReason: ${reason}`,
        });
    }
    report(options) {
        const embed = new discord_js_1.MessageEmbed();
        if (options.colour)
            embed.setColor(options.colour);
        if (options.title)
            embed.setTitle(options.title);
        if (options.description)
            embed.setDescription(options.description);
        if (options.footer)
            embed.setFooter(options.footer);
        if (options.author && options.author[1])
            embed.setAuthor(options.author[0], options.author[1] ? options.author[1] : undefined);
        this.reportChannel.send({ embeds: [embed] });
    }
    async getWarns() {
        const warns = await this.warnings.find();
        if (!warns.length)
            return false;
        return warns;
    }
    async getWarn(id) {
        const warns = await this.warnings.findById(id);
        return warns || false;
    }
    async mute(user, expiration) {
        try {
            await this.set(`mutes/${user.id}`, {
                time: Date.now() + expiration,
            });
            await user.roles.add("871100739248848966");
        }
        catch {
            return;
        }
    }
    time(text) {
        text = text.toLowerCase();
        return /^(\d+[mhsd]\s?)+$/gi.test(text)
            ? eval("( " +
                text
                    .replace("m", " * 60 + ")
                    .replace("h", " * 60 * 60 + ")
                    .replace("d", " * 24 * 60 * 60 + ")
                    .replace("s", " + 0 + ") +
                "0 ) * 1000")
            : false;
    }
    caps(text) {
        return text
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b[a-zA-Z]/g, (m) => m.toUpperCase());
    }
    convert(number, decimals = 0) {
        let totalSeconds = number / 1000;
        let days = Math.floor(totalSeconds / 86400).toFixed() || 0;
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600).toFixed() || 0;
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60).toFixed() || 0;
        let seconds = totalSeconds % 60 || 0;
        seconds = +seconds.toFixed(decimals);
        return this.convertLong([+days, +hours, +minutes, seconds]);
    }
    convertLong(converted) {
        {
            let days = converted[0];
            let hours = converted[1];
            let minutes = converted[2];
            let seconds = converted[3];
            let dias = "days";
            let horas = "hours";
            let minutos = "minutes";
            let segundos = "seconds";
            if (+days <= 0) {
                days = "";
                dias = "";
            }
            if (+days === 1)
                dias = dias.replace("s", "");
            if (+hours <= 0) {
                hours = "";
                horas = "";
            }
            if (+hours === 1)
                horas = "hour";
            if (+minutes <= 0) {
                minutes = "";
                minutos = "";
            }
            if (+minutes === 1)
                minutos = "minute";
            if (+seconds <= 0) {
                seconds = "";
                segundos = "";
            }
            if (+seconds === 1)
                segundos = "second";
            return [days, dias, hours, horas, minutes, minutos, seconds, segundos]
                .join(" ")
                .split(/[ ]+/)
                .join(" ")
                .trim();
        }
    }
    async unmute(member) {
        try {
            await member.roles.remove("871100739248848966");
            await this.remove(`mutes/${member.id}`);
        }
        catch {
            return;
        }
    }
}
exports.default = Client;
