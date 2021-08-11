import { Client as DJSClient, Collection, ClientOptions } from "discord.js";
import { join } from "path";
import { readdir, lstat } from "fs/promises";
import { Client as Bot, key, Command } from "./utils";

class Client extends DJSClient implements Bot {

  public prefix: "-";
  public commands: Collection<key, Command>;
  public categories: Collection<key, string[]>;
  
  constructor(options: ClientOptions) {
    super(options);
    this.prefix = "-";
    this.commands = new Collection();
    this.categories = new Collection();

    this.on("messageCreate", (message) => {
      if (message.author.bot || message.channel.type === "DM") return;

      const { prefix } = this;
      if (!message.content.startsWith(prefix)) return;

      let args = message.content.split(prefix);
      args.shift();

      const command =
        this.commands.find((c) =>
          args.join(" ").toLowerCase().startsWith(c.name.toLowerCase())
        ) ||
        this.commands.find((c) =>
          c.aliases!
             .map((a) => a.toLowerCase())
            .some((b) => args.join(" ").startsWith(b))
        );

      if (!command) return;

      const toSplit = args.join(" ").startsWith(command.name)
        ? command.name
        : command.aliases
            ?.map((a) => a.toLowerCase())
            .find((b) => args.join(" ").startsWith(b));

      args = args.join(" ").split(toSplit!).slice(1).join(" ").split(/ +/g);
      command.run({ client: this, args, message });

      return;
    });
  }

  async Commands(dir: string, callback?: (name?: string, command?: Command) => unknown) {
    const files = await readdir(join(__dirname, dir));
    for (const file of files) {
      const stat = await lstat(join(__dirname, dir, file));
      if (stat.isDirectory()) this.Commands(join(__dirname, dir));
      else if (!file.endsWith(".ts" || file.endsWith(".d.ts"))) continue;

      const command = (await import(join(__dirname, dir, file))).default;
      this.commands.set(command.name.toLowerCase(), command);
      callback!(command.name, command);

      if (command.category) {
        let categoryGetter = this.categories.get(
          command.category.toLowerCase()
        );
        if (!categoryGetter) categoryGetter = [command.category.toLowerCase()];
        categoryGetter.push(command.name.toLowerCase());

        this.categories.set(command.name.toLowerCase(), categoryGetter);
      }
    }

    return this;
  }
};

export default Client