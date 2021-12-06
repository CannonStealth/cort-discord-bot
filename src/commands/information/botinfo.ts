import { Command } from "../../types";
import { version, MessageEmbed } from "discord.js";

export default {
  name: "bot",
  aliases: ["botinfo"],
  category: "Information",
  description: "Shows some information about the bot",
  async run({ client, message }) {
    const embed = new MessageEmbed()
      .setThumbnail(client.user!.displayAvatarURL())
      .setTitle("Bot Information")
      .addField("Uptime", client.convert(client.uptime!), true)
      .addField(
        "Created",
        `<t:${Math.round(client.application!.createdTimestamp! / 1000)}:R>`,
        true
      )
      .addField(
        "Memory Used",
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        true
      )
      .addField("Ram Usage", `${formatBytes(process.memoryUsage().rss)}`, true)
      .addField("Discord.JS Version", version, true)
      .addField("Lines of Code", client.codeInfo.lines.toString(), true)
      .addField("Number of Files", client.codeInfo.files.toString(), true)
      .addField("Ping", `${client.ws.ping}ms`, true)
      .setColor("GREEN");
    message.channel.send({ embeds: [embed] });
  },
} as Command;

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
