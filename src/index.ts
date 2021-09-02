import Client from "./Client";
import { config as dotenv } from "dotenv";
import { TextChannel, Message } from "discord.js"
import TikTok from "tiktok-scraper";

const userID = "pingouro"

dotenv({ path: "src/.env" }); // Accessing .env files

const client = new Client({ intents: 32767 }); // Defining client

client.on("ready", async () => {
  client.user!.setPresence({
    activities: [{ name: "Clash Or Trash", type: "WATCHING" }],
    status: "idle",
  }); // Setting client's status

  await client.SlashCommands("./slash", ({ name }) => console.log("Creating | Updating slash command " + name))
  await client.Commands("./commands", ({ name }) => console.log(`Loading command ${name}`))


  const userId = (await TikTok.getUserProfileInfo(userID)).user.id
  const user = await TikTok.user(userId)


});


client.login(process.env!.TOKEN); // Login the client