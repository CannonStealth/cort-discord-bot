import { Client as DJSClient, Collection, ClientOptions } from "discord.js";
import { join } from "path";
import { readdir, lstat } from "fs/promises";
import { Client as Bot, key, Command, Slash } from "./types";
import Clash from "./Clash";

class Client extends DJSClient implements Bot {
  public readonly prefix: "-";
  public commands: Collection<key, Command>;
  public aliases: Collection<string, string>;
  public categories: Collection<string, string[]>;
  public slashCommands: Collection<string, Slash>;
  public readonly clashRoyale: Clash;

  constructor(options: ClientOptions) {
    super(options);
    this.prefix = "-";
    this.commands = new Collection();
    this.categories = new Collection();
    this.aliases = new Collection();
    this.slashCommands = new Collection();
    this.clashRoyale = new Clash(process.env.CLASH_TOKEN!);

    this.on("messageCreate", (message) => {
      if (message.author.bot || message.channel.type === "DM") return;

      const { prefix } = this;
      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/g);

      const cmdName = args.shift();

      if (
        !message.content.startsWith(
          `${prefix.toLowerCase()}${cmdName?.toLowerCase()}`
        )
      )
        return;

      const cmd =
        this.commands.get(cmdName!.toLowerCase()) ||
        this.commands.get(this.aliases.get(cmdName!.toLowerCase())!);

      if (!cmd) return;

      cmd.run({ client: this, args, message });
      return;
    });

    this.on("interactionCreate", async (interaction) => {
      if (!interaction.inGuild() && interaction.isCommand()) {
        return interaction.reply("Try using slash commands in a guild!");
      }

      const user = interaction.user;
      const member = await interaction.guild!.members.fetch(user.id);
      const guild = interaction.guild!;

      if (interaction.isCommand()) {
        let cmd = this.slashCommands.get(interaction.commandName);

        if (!cmd) return;
        cmd.run({ client: this, interaction, member, guild, user });
      }
    });
  }

  private async loader<T>(dir: string, callback?: (command: T) => unknown) {
    const files = await readdir(join(__dirname, dir));
    for (const file of files) {
      const stat = await lstat(join(__dirname, dir, file));
      if (stat.isDirectory()) this.Commands(join(__dirname, dir));
      else if (!file.endsWith(".ts" || file.endsWith(".d.ts"))) continue;

      const command = (await import(join(__dirname, dir, file))).default;
      callback!(command);
    }
  }

  public async Commands(dir: string, callback?: (cmd: Command) => unknown) {
    this.loader(dir, (command: Command) => {
      this.commands.set(command.name.toLowerCase(), command);

      callback!(command);

      if (command.aliases?.length)
        for (const alias of command.aliases)
          this.aliases.set(alias, command.name);

      if (command.category) {
        let categoryGetter = this.categories.get(
          command.category.toLowerCase()
        );
        if (!categoryGetter) categoryGetter = [command.category.toLowerCase()];
        categoryGetter.push(command.name.toLowerCase());

        this.categories.set(command.name.toLowerCase(), categoryGetter);
      }
    });

    return this;
  }

  public SlashCommands<T>(dir: string, callback?: (file: Slash) => unknown) {
    const application = this.application!;

    this.loader(dir, (file: Slash) => {
      this.slashCommands.set(file.name, file);
      if (!file.stop) {
        const toSend = {
          name: file.name,
          description: file.description,
          defaultPermission: file.default,
          options: file.options,
        };

        if (file.guilds && file.guilds.length) {
          for (const guild of file.guilds) {
            application.commands
              .create(toSend, guild)
              .then(() => callback!(file));
          }
        } else {
          application.commands.create(toSend).then(() => callback!(file));
        }
      }
    });

    return this;
  }
}

export default Client;
