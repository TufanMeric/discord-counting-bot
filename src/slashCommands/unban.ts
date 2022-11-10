import {
  ChannelType,
  CommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../types';
import { getCountingChannel, unbanUser } from '../functions';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .addUserOption(o =>
      o.setName('user').setDescription('User to unban').setRequired(true)
    )
    .setName('countingunban')
    .setDescription('Unbans user from counting'),
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
        await unbanUser(
          interaction.client,
          c,
          interaction.options.getUser('user', true)
        );
        await interaction.followUp({
          content: 'User unbanned',
          ephemeral: true,
        });
      })
      .catch(reason =>
        interaction.followUp({
          content: 'Unknown error while unbanning user: ' + reason,
          ephemeral: true,
        })
      );
  },
};

export default command;
