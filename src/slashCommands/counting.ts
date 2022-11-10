import {
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../types';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('counting')
    .setDescription(
      'Makes current channel the counting channel for this guild.'
    ),
  async execute(interaction: CommandInteraction) {
    if (
      !interaction.guildId ||
      interaction.channel?.type != ChannelType.GuildText ||
      interaction.channelId == null
    )
      return;

    let perms = interaction.member?.permissions as PermissionsBitField;
    if (
      !perms.has([PermissionsBitField.Flags.ManageChannels], true) &&
      (!process.env.SUPERADMIN_ID ||
        interaction.user.id != process.env.SUPERADMIN_ID)
    )
      return;

    let database = interaction.client.prisma;
    await database.server.upsert({
      where: { id: interaction.guildId as string },
      create: {
        id: interaction.guildId as string,
        total_ruined: 0,
        peak_num: 0,
        current_num: 0,
        counting_channel: interaction.channelId,
      },
      update: {},
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: 'Counting channel set' })
          .setDescription(`Users may now start counting in this channel.`),
      ],
      ephemeral: true,
    });
  },
};

export default command;
