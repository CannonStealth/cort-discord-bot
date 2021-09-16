import { MessageEmbed } from "discord.js";
import { Command } from "../types";
const x = "`";


export default {
  name: "help",
  description: "Shows all commands or a specific command information",
  run({ message, args, client }) {
    const prefix = client.prefix;

    const allEmbed: MessageEmbed = new MessageEmbed()
      .setColor("GREEN")
      .setAuthor(
        `${message.guild!.name} Available Commands List`,
        message.guild!.iconURL()!
      );

    if (args[0]) getInfo(args[0].toLowerCase());
    else help();

    function getInfo(command: string) {
      const cmd =
        client.commands.get(command) ??
        client.commands.get(client.aliases.get(command)!);
      if (!cmd) return category();

      const infoEmbed = new MessageEmbed()
        .setTitle(`${cmd.name} Command Info`)
        .setColor("GREEN");

      if (cmd.description)
        infoEmbed.addField("Description", x + cmd.description + x, false);
      if (cmd.usage)
        infoEmbed.addField(
          "Usage",
          x + prefix + cmd.name + " " + cmd.usage + x,
          false
        );
      else infoEmbed.addField("Usage", x + prefix + cmd.name + x, false);
      if (cmd.example)
        infoEmbed.addField(
          "Example",
          x + prefix + cmd.name + " " + cmd.example + x,
          false
        );
      else infoEmbed.addField("Example", x + prefix + cmd.name + x, false);

      infoEmbed.setFooter(
        `Requested by ${
          message.member!.displayName || message.author.username
        }`,
        message.author.displayAvatarURL()
      );

      if (cmd.aliases || typeof cmd.aliases != "undefined")
        infoEmbed.addField(
          "Aliases",
          x + "❯ " + cmd.aliases.join(",\n❯ ") + x,
          false
        );

      return message.channel.send({ embeds: [infoEmbed] });
    }

    function help() {
      let total = 0;

      client.categories.forEach((category: string[]) => {
        let desc: string[] = [];

        category.slice(1).forEach((cmd: string) => {
          let command = client.commands.get(cmd.toLowerCase());
          if (!command) return;

          desc.push(cmd);
          total++;
        });

        if (!desc[0]) return;

        allEmbed.addField(
          "**" + client.caps(category[0]) + "**",
          "`" + desc.join("`, `") + "`"
        );
      });

      allEmbed
        .setDescription(
          `${client.user!.username} total available commands: **${total}**`
        )
        .setThumbnail(client.user!.displayAvatarURL())
        .setFooter(
          `Requested by ${
            message.member!.displayName || message.author.username
          }`,
          message.author.displayAvatarURL()
        );
      return message.channel.send({ embeds: [allEmbed] });
    }

    function category() {
      const categoryEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setFooter(
          `Requested by ${
            message.member!.displayName || message.author.username
          }`,
          message.author.displayAvatarURL()
        );

      let desc: string = " ".trim();
      let total: number = 0;

      let category = client.categories.get(args.join(" ").toLowerCase());
      if (!category) return help();

      category.slice(1).forEach((cmd: string) => {
        let command = client.commands.get(cmd.toLowerCase());
        if (!command) return;

        let description;

        if (command.description)
          description = " - " + "`" + command.description + "`";
        else description = " ";
        desc += "**" + prefix + command.name + "**" + description + "\n";
        total++;
      });

      if (total == 0) return help();

      categoryEmbed
        .setDescription(desc)

        .setAuthor(
          `${message.guild!.name} ${client.caps(
            category[0]
          )} Available Commands (${total})`,
          message.guild!.iconURL()!
        );

      return message.channel.send({ embeds: [categoryEmbed] });
    }
  },
} as Command;
