import {
  Collection,
  Message,
  ApplicationCommandOptionData,
  CommandInteraction,
  Guild,
  GuildMember,
  User
} from "discord.js";

export type Awaited<T> = T | Promise<T>;
export type key = string | number | symbol;

type Run = {
  client: Client;
  args: string[];
  message: Message;
};

type SlashRun = {
  client: Client;
  interaction: CommandInteraction;
  member: GuildMember;
  guild: Guild;
  user: User;
};

export interface Command {
  name: string;
  aliases?: string[];
  category?: string;
  run: ({}: Run) => Awaited<unknown>;
}

export interface Client {
  prefix: "-";
  commands: Collection<key, Command>;
  categories: Collection<string, string[]>;
  aliases: Collection<string, string>;
  slashCommands: Collection<string, Slash>;
}

export interface Slash {
  name: string;
  description: string;
  default?: boolean;
  options?: Array<ApplicationCommandOptionData>;
  guilds?: string[]
  stop?: boolean
  run: ({}: SlashRun) => Awaited<unknown>;
}
