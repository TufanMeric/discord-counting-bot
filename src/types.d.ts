import {
  SlashCommandBuilder,
  CommandInteraction,
  Collection,
  PermissionResolvable,
  Message,
} from 'discord.js';
import { PrismaClient } from '@prisma/client';

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => void;
}

export interface Command {
  name: string;
  execute: (message: Message, args: Array<string>) => void;
  permissions: Array<PermissionResolvable>;
  aliases: Array<string>;
}

export interface BotEvent {
  name: string;
  once?: boolean | false;
  execute: (...args: any) => void;
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    commands: Collection<string, Command>;
    prisma: PrismaClient;
  }
}
