import { ChannelType, Events, Message } from 'discord.js';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: Events.MessageDelete,
  execute: async (message: Message) => {
    if (
      message.author.bot ||
      message.content.startsWith('--') ||
      !message.guildId
    )
      return;

    const database = message.client.prisma;
    const guild = await database.server.findFirst({
      where: { id: message.guildId },
    });

    if (guild == null) {
      return;
    }

    if (message.channelId == guild.counting_channel) {
      await message.channel.send(
        `**[SNITCHING]** Someone's (<@${
          message.author.id
        }>) message was deleted! MODS!\nNext number is: **${
          guild.current_num + 1
        }**`
      );
    }
  },
};

export default event;
