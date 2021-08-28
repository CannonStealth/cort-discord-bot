import {
  Collection,
  Message,
  ApplicationCommandOptionData,
  CommandInteraction,
  Guild,
  GuildMember,
  User
} from "discord.js";

import Clash from "./Clash"

// Does it return a promise or not
export type Awaited<T> = T | Promise<T>;

// Keys for records
export type key = string | number | symbol;


// Run types for normal commands
type Run = {
  client: Client;
  args: string[];
  message: Message;
};


// Run types for slash commands
type SlashRun = {
  client: Client;
  interaction: CommandInteraction;
  member: GuildMember;
  guild: Guild;
  user: User;
};

// How a normal command should look like
export interface Command {
  name: string;
  aliases?: string[];
  category?: string;
  run: ({}: Run) => Awaited<unknown>;
  description?: string;
}

// Our Client
export interface Client {
  prefix: "-";
  commands: Collection<key, Command>;
  categories: Collection<string, string[]>;
  aliases: Collection<string, string>;
  slashCommands: Collection<string, Slash>;
  clashRoyale: Clash;
}

// How a Slash command should look like
export interface Slash {
  name: string;
  description: string;
  default?: boolean;
  options?: Array<ApplicationCommandOptionData>;
  guilds?: string[]
  stop?: boolean
  run: ({}: SlashRun) => Awaited<unknown>;
}

// Clash class interface
export interface ClashInterface {
  token: string;
}