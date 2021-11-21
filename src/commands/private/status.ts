import {
  ExcludeEnum,
  Message,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
  PresenceStatusData,
} from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import Client from "../../Client";
import { Command } from "../../types";

const generateButtons = (...arr: { name: string; id: string }[]) => {
  const values: MessageButton[] = [];
  for (const { name, id } of arr) {
    values.push(
      new MessageButton().setCustomId(name).setEmoji(id).setStyle("PRIMARY")
    );
  }
  return values;
};

const components = [
  new MessageActionRow().addComponents(
    generateButtons(
      { name: "online", id: "911298261095170079" },
      { name: "idle", id: "911298260898033674" },
      { name: "dnd", id: "911298260910608384" },
      { name: "invisible", id: "911298260977729566" }
    )
  ),
];

const component = [
  new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("PLAYING")
      .setLabel("Playing")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("LISTENING")
      .setLabel("Listening")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("WATCHING")
      .setLabel("Watching")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("COMPETING")
      .setLabel("Competing")
      .setStyle("PRIMARY")
  ),
];

export default {
  name: "status",
  async run({ message, client, args }) {
    try {
      if (message.author.id !== "811657485462274129")
        return message.channel.send("Only Cannon can use this command");

      await setActivityCollector(client, message);
    } catch (e) {
      return message.channel.send("Error");
    }

    return;
  },
} as Command;

async function setActivityCollector(client: Client, message: Message) {
  const msg = await message.channel.send({
    embeds: [new MessageEmbed().setTitle("Choose Status").setColor("BLUE")],
    components,
  });

  const filter = (i: MessageComponentInteraction) =>
    i.message.author.id === client.user!.id && i.user.id === message.author.id;

  const collector = message.channel.createMessageComponentCollector({
    filter,
    time: 30000,
  });

  collector.on("collect", async (i) => {
    collector.stop()
    await setType(client, msg, message, i.customId as PresenceStatusData);
  });
}

async function setType(
  client: Client,
  msg: Message,
  message: Message,
  status: PresenceStatusData
) {
  msg.edit({
    components: component,
    embeds: [new MessageEmbed().setTitle("Choose Type").setColor("BLUE")],
  });

  const filter = (i: MessageComponentInteraction) =>
    i.message.author.id === client.user!.id && i.user.id === message.author.id;

  const collector = message.channel.createMessageComponentCollector({
    filter,
    time: 30000,
  });

  collector.on("collect", async (i) => {
    collector.stop()
    await setActivity(client, msg, message, status, i.customId);
  });
}

async function setActivity(
  client: Client,
  msg: Message,
  message: Message,
  status: PresenceStatusData,
  type: string
) {
  msg.edit({
    components: [],
    embeds: [new MessageEmbed().setTitle("Send Activity").setColor("BLUE")],
  });

  const filter = (MessagE: Message) =>
    MessagE.author.id !== client.user!.id &&
    MessagE.author.id === message.author.id;

  const collector = message.channel.createMessageCollector({
    filter,
    time: 30000,
  });

  collector.on("collect", async (message) => {
    collector.stop()
    await end(client, msg, message, status, type as ExcludeEnum<typeof ActivityTypes, "CUSTOM">, message.content)
  });
}

async function end(
  client: Client,
  msg: Message,
  message: Message,
  status: PresenceStatusData,
  type: ExcludeEnum<typeof ActivityTypes, "CUSTOM">,
  activity: string
) {

  if (activity.length > 128) return msg.delete()
  msg.edit({ embeds: [], content: "Editing status..."})

  await client.user!.setPresence({
    status, activities: [{ type, name: activity }]
  })

  const sts = await client.get("status")

  if (!sts || !("status" in sts || "type" in sts || "activity" in sts)) {
    client.set("status", { activity, status, type })
  } else {
    client.update("status", { activity, status, type })
  }

  return
}
