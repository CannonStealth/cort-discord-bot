import Client from "./Client";
import { config as dotenv } from "dotenv";

dotenv({ path: "src/.env" }); // Accessing .env files

const client = new Client({ intents: 32767 }); // Defining client

client.on("ready", async () => {
  client.user!.setPresence({
    activities: [{ name: "Clash Or Trash", type: "WATCHING" }],
    status: "idle",
  }); // Setting client's status

  await client.SlashCommands("./slash", ({ name }) => console.log("Creating | Updating slash command " + name))
  await client.Commands("./commands", ({ name }) => console.log(`Loading command ${name}`))



  // Enable slash commands and normal commands
});


client.login(process.env!.TOKEN); // Login the client