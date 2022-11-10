import {
  ChannelType,
  CommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../types';
import { banUser, getCountingChannel } from '../functions';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .addUserOption(o =>
      o.setName('user').setDescription('User to ban').setRequired(true)
    )
    .setName('countingban')
    .setDescription('Bans user from counting'),
  async execute(interaction: CommandInteraction) {
    if (!interaction.guildId) return;

    let perms = interaction.member?.permissions as PermissionsBitField;
    if (
      !perms.has([PermissionsBitField.Flags.ManageChannels], true) &&
      (!process.env.SUPERADMIN_ID ||
        interaction.user.id != process.env.SUPERADMIN_ID)
    )
      return;

    await interaction.deferReply();
    getCountingChannel(
      interaction.client,
      interaction.client.prisma,
      interaction.guildId
    )
      .then(async c => {
        await banUser(
          interaction.client,
          c,
          interaction.options.getUser('user', true)
        );
        await interaction.followUp({
          content: 'User banned',
          ephemeral: true,
        });
      })
      .catch(reason =>
        interaction.followUp({
          content: 'Unknown error while banning user: ' + reason,
          ephemeral: true,
        })
      );
  },
};

export default command;
