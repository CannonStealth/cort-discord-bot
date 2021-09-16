import Client from "./Client";
import { TextChannel } from "discord.js";



const client = new Client({ intents: 32767 }); // Defining client

client.on("ready", async () => {

  client.welcomeChannel = await client.channels.fetch("864586491505147904") as TextChannel
  client.reportChannel = await client.channels.fetch("887408209441218580") as TextChannel

  client.user!.setPresence({
    activities: [{ name: "ClashOrTrash", type: "WATCHING" }],
    status: "idle",
  }); // Setting client's status

  await client.SlashCommands("./slash", ({ name }) =>
    console.log("Creating | Updating slash command " + name)
  );
  await client.Commands("./commands", ({ name }) =>
    console.log(`Loading command ${name}`)
  );

  setInterval(async () => client.checkMutesAndWarns(await client.guilds.fetch("864586393341394954")), 1 * 60 * 1000)

});

client.login(client.clientToken!); // Login the client
