import { ChannelType, Events, Message } from 'discord.js';
import { BotEvent } from '../types';
import {
  banUser,
  increaseRuinCount,
  setCount,
  setLastCountingUser,
  setPeakCount,
} from '../functions';
import { nanoid } from 'nanoid';

// This mutex/queue thingy is hideous and would not be needed if I do a bit of refactoring
// But it works, so it will stay here for the rest of eternity
let mutex: { [key: string]: any[] } = {};

const lock = async (key: string) => {
  if (!mutex.hasOwnProperty(key)) mutex[key] = [];
  const id = nanoid(8);
  mutex[key].push(id);

  while (true) {
    const result = await new Promise(resolve =>
      setTimeout(() => {
        if (mutex[key][0] === id) resolve(true);
        else resolve(false);
      }, 1 / 30)
    );

    if (result) break;
  }
};

const release = (key: string) => {
  mutex[key].shift();
};

const event: BotEvent = {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (
      !message.member ||
      message.author.bot ||
      message.content.startsWith('--')
    )
      return;
    if (!message.guildId || message.channel.type != ChannelType.GuildText)
      return;

    await lock(message.guildId);

    const database = message.client.prisma;
    const guild = await database.server.findFirst({
      where: { id: message.guildId },
    });

    if (guild == null) {
      release(message.guildId);
      return;
    }

    if (message.channelId == guild.counting_channel) {
      let content_original = message.content;
      let content_sanitized = content_original.replaceAll(
        /((<(.*)>)|(\s)|([^\x00-\x7F]+)|([-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)))/g,
        ''
      );

      let expressions_arr = content_sanitized.match(/(\d+)([+\-/*^%]\d+)*/g);
      if (expressions_arr === null) {
        release(message.guildId);
        return;
      }

      let expression = expressions_arr[0];
      let evaluated = eval(expression) as Number;

      if (evaluated == null) {
        await message.reply(
          'This message contains an expression that could not be evaluated.'
        );
        release(message.guildId);
        return;
      }

      // Ban and ruin for counting twice
      if (message.author.id == guild.last_counting_user) {
        await Promise.all([
          message.react('❌'),
          message.reply(
            `Attempted to count twice. Next number is: **1**.\n<@${message.author.id}> was banned for this.`
          ),
          setCount(database, guild.id, 0),
        ]);
        await increaseRuinCount(database, guild.id);
        await banUser(message.client, message.channel, message.author);
      } else if (evaluated != guild.current_num + 1) {
        await Promise.all([
          message.react('❌'),
          message.reply(
            `Message \`${content_original.replaceAll(
              '`',
              ''
            )}\` contains expression \`${expression}\` which evaluated to \`${evaluated}\`. It should have been **${
              guild.current_num + 1
            }**. Next number is: **1**.\n<@${
              message.author.id
            }> was banned for this.`
          ),
          setCount(database, guild.id, 0),
        ]);
        await increaseRuinCount(database, guild.id);
        await banUser(message.client, message.channel, message.author);
        await setLastCountingUser(database, guild.id, message.author);
      } else {
        // Successful counting PagMan
        await Promise.all([
          message.react('✅'),
          setCount(database, guild.id, guild.current_num + 1),
        ]);
        if (guild.current_num + 1 > guild.peak_num) {
          await setPeakCount(database, guild.id, guild.current_num + 1);
        }
        await setLastCountingUser(database, guild.id, message.author);
      }
    }
    release(message.guildId);
  },
};

export default event;
