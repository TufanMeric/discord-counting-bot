import {
  ChannelType,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../types';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('countingbotping')
    .setDescription('How slow is the counting bot?'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: `My ping is **${interaction.client.ws.ping}ms**`,
      ephemeral: true,
    });
  },
};

export default command;
