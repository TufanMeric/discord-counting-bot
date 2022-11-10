import * as dotenv from 'dotenv';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { Command, SlashCommand } from './types';
import { join } from 'path';
import { readdirSync } from 'fs';
import { PrismaClient } from '@prisma/client';

// Read .env
dotenv.config();

// I'm not exactly sure if all those intents are required for this
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Only good thing about JS/TS is that I can add my fancy objects to any other object PagMan
client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.prisma = new PrismaClient();

// Register everything
let handlersDir = join(__dirname, './handlers');

readdirSync(handlersDir).forEach(file => {
  if (!file.endsWith('.js') && !file.endsWith('.ts')) return;
  require(`${handlersDir}/${file}`)(client);
});

client.once(Events.ClientReady, async c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN).then(() => {});
