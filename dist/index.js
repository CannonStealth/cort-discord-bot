"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./Client"));
const client = new Client_1.default({ intents: 32767 }); // Defining client
client.on("ready", async () => {
    client.welcomeChannel = await client.channels.fetch("864586491505147904");
    client.reportChannel = await client.channels.fetch("887408209441218580");
    client.user.setPresence({
        activities: [{ name: "ClashOrTrash", type: "WATCHING" }],
        status: "idle",
    }); // Setting client's status
    await client.SlashCommands("./slash", ({ name }) => console.log("Creating | Updating slash command " + name));
    await client.Commands("./commands", ({ name }) => console.log(`Loading command ${name}`));
    setInterval(async () => client.checkMutesAndWarns(await client.guilds.fetch("864586393341394954")), 1 * 60 * 1000);
});
client.login(client.clientToken); // Login the client
