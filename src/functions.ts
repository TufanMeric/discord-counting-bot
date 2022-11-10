import {
  Client,
  GuildChannel,
  NonThreadGuildBasedChannel,
  User,
} from 'discord.js';
import { PrismaClient } from '@prisma/client';

export async function banUser(
  client: Client,
  channel: GuildChannel,
  user: User
): Promise<NonThreadGuildBasedChannel> {
  return channel.permissionOverwrites.create(
    user.id,
    { AddReactions: true, SendMessages: false },
    { reason: 'Banned from channel' }
  );
}

export async function unbanUser(
  client: Client,
  channel: GuildChannel,
  user: User
) {
  return channel.permissionOverwrites.delete(user.id);
}

export async function getCountingChannel(
  client: Client,
  db: PrismaClient,
  guild: string
): Promise<GuildChannel> {
  let countingChannelId = await db.server.findFirst({
    where: { id: guild },
    select: {
      counting_channel: true,
    },
  });

  if (countingChannelId?.counting_channel == undefined) return Promise.reject();

  let guildObject = client.guilds.cache.get(guild);
  if (guildObject == null) return Promise.reject();

  let channelObject = guildObject.channels.cache.get(
    countingChannelId.counting_channel
  );
  if (channelObject == undefined) return Promise.reject();
  return channelObject as GuildChannel;
}

export async function setCount(db: PrismaClient, guild: string, count: number) {
  return db.server.update({
    where: { id: guild },
    data: {
      current_num: count,
    },
  });
}

export async function setPeakCount(
  db: PrismaClient,
  guild: string,
  count: number
) {
  return db.server.update({
    where: { id: guild },
    data: {
      peak_num: count,
    },
  });
}

export async function increaseRuinCount(db: PrismaClient, guild: string) {
  return db.server.update({
    where: { id: guild },
    data: {
      total_ruined: {
        increment: 1,
      },
    },
  });
}

export async function setLastCountingUser(
  db: PrismaClient,
  guild: string,
  user: User
) {
  return db.server.update({
    where: { id: guild },
    data: {
      last_counting_user: user.id,
    },
  });
}
