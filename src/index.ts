import Client from "./Client";
import { config as dotenv } from "dotenv";
dotenv({ path: "src/.env" });

const client = new Client({ intents: 32767 });

client.on("ready", () => {
  client.user!.setPresence({
    activities: [{ name: "Clash Or Trash", type: "WATCHING" }],
    status: "idle",
  });

  client
  .SlashCommands("./slash", ({ name }) => console.log("Creating | Updating slash command " + name))
  .Commands("./commands", ({ name }) => console.log(`Loading command ${name}`));
});

client.login(process.env!.TOKEN);
