import { Events, Interaction } from 'discord.js';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    let command = interaction.client.slashCommands.get(interaction.commandName);
    command?.execute(interaction);
  },
};

export default event;
