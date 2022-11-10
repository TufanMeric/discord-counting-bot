import {
  ChannelType,
  CommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../types';
import { setCount } from '../functions';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .addNumberOption(o =>
      o.setName('count').setDescription('new count').setRequired(true)
    )
    .setName('countingset')
    .setDescription('Sets current count'),
  async execute(interaction: CommandInteraction) {
    if (!interaction.guildId) return;

    let perms = interaction.member?.permissions as PermissionsBitField;
    if (
      !perms.has([PermissionsBitField.Flags.ManageChannels], true) &&
      (!process.env.SUPERADMIN_ID ||
        interaction.user.id != process.env.SUPERADMIN_ID)
    )
      return;

    await setCount(
      interaction.client.prisma,
      interaction.guildId,
      interaction.options.get('count')?.value as number
    );
    await interaction.reply({
      content: 'Current count has been set.',
    });
  },
};

export default command;
