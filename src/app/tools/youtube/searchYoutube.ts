'use server';
import { redis } from '@/helper/redis';

import * as yt from 'youtube-search-without-api-key';

export const searchVideo = async (search: string) => {
  const redisKey = `youtube-search:${search}`;
  const getDataFromRedis = await redis.get(redisKey);
  if (getDataFromRedis) return JSON.parse(getDataFromRedis);
  const data = await yt.search(search);
  redis.set(redisKey, JSON.stringify(data), {
    EX: (60 * 60) * 24,
  });
  return data;
};
