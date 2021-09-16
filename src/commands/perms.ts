import { PermissionResolvable, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../types";

const yes = "✔️";
const no = "❌";
const x = "```";
const s = "📛";
const c = "♨️";

/**
 * @param text - Should be a string
 */


const permissions: PermissionResolvable[] = [
  "CREATE_INSTANT_INVITE",
  "KICK_MEMBERS",
  "BAN_MEMBERS",
  "ADMINISTRATOR",
  "MANAGE_CHANNELS",
  "MANAGE_GUILD",
  "ADD_REACTIONS",
  "VIEW_AUDIT_LOG",
  "PRIORITY_SPEAKER",
  "STREAM",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_TTS_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "MENTION_EVERYONE",
  "USE_EXTERNAL_EMOJIS",
  "VIEW_GUILD_INSIGHTS",
  "CONNECT",
  "SPEAK",
  "MUTE_MEMBERS",
  "DEAFEN_MEMBERS",
  "MOVE_MEMBERS",
  "USE_VAD",
  "CHANGE_NICKNAME",
  "MANAGE_NICKNAMES",
  "MANAGE_ROLES",
  "MANAGE_WEBHOOKS",
  "MANAGE_EMOJIS_AND_STICKERS",
  "USE_APPLICATION_COMMANDS",
  "REQUEST_TO_SPEAK",
  "MANAGE_THREADS",
  "USE_PUBLIC_THREADS",
  "USE_PRIVATE_THREADS",
  "USE_EXTERNAL_STICKERS",
];

export default {
  name: "permissions",
  aliases: ["perm", "perms"],
  category: "Information",
  description: "Shows a user permission",
  usage: "[@user] [#channel]",
  example: "@Rubidium #general",
  async run({ message, args, client }) {
    message.member!.permissions.toArray();

    const channel = (message.mentions.channels.first() ||
      message.channel) as TextChannel;

    let user =
      message.mentions.members!.first() ||
      message.guild!.members.cache.get(args[0]) ||
      message.member;
    let userId = user!.user.id;

    let description = `Server - ${s}\n${
      (message.mentions.channels.first() as TextChannel)?.name ||
      "Current Channel"
    } - ${c}\n\n${s} | ${c}\n`;

    let embed = new MessageEmbed()
      .setTitle(`${user!.user.username} Permissions`)
      .setColor(user!.displayColor);

    permissions.forEach((perm) => {
      description += `${user!.permissions.has(perm) ? yes : no} | ${
        channel.permissionsFor(userId)!.has(perm) ? yes : no
      } - ${client.caps(perm as string)}\n`;
    });
    embed.setDescription(x + description + x);

    return message.channel.send({ embeds: [embed] });
  },
} as Command;
