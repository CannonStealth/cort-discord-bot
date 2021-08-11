import { Collection, Message } from "discord.js"

export type Awaited<T> = T | Promise<T>
export type key = string | number | symbol

type Run = {
    client: Client;
    args: string[];
    message: Message
} 

export interface Command {
    name: string;
    aliases?: string[];
    category?: string;
    run: ({}: Run) => Awaited<unknown>
}

export interface Client {
    prefix: "-";
    commands: Collection<key, Command>;
    categories: Collection<string, string[]>;
    aliases: Collection<string, string>;
  }