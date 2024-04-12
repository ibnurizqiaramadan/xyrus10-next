'use server';

import { Video } from '@/helper/type';
import { create } from 'youtube-dl-exec';
import _ from 'lodash';
import { redis } from '@/helper/redis';
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
const youtubedl = create(serverRuntimeConfig.ytDlPath);

/**
 * Filters the formats to retrieve only those with the 'mp4' extension
 * and not from 'manifest.googlevideo.com'.
 *
 * @param {any} output - the output object containing formats
 * @return {Array} the filtered array of formats
 */
const checkFormat = (output:any): Array<any> => {
  return output.formats.filter((x:any) =>
    (x.ext === 'mp4' || x.ext === 'm4a') && !String(x.url).includes('manifest.googlevideo.com')
  );
};

/**
 * Retrieves video formats from the given URL.
 *
 * @param {string} url - The URL of the video
 * @return {Promise<Video>} A Promise that resolves with video details and formats
 */
export const getFormats = (url: string): Promise<Video> => {
  const redisKey = `youtube:${url}`;
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<Video>(async (resolve, reject) => {
    const getDataFromRedis: Video = await redis.hGetAll(redisKey) as unknown as Video;
    if (getDataFromRedis.details) {
      return resolve({
        details: JSON.parse(String(getDataFromRedis.details)),
        formats: JSON.parse(String(getDataFromRedis.formats)),
      });
    }

    youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
    }).then((output:any) => {
      if (!output) {
        return resolve({ details: null, formats: [] });
      }
      const filter = checkFormat(output);
      if (filter.length == 0) return [];
      const result = _.orderBy(filter, [ 'audio_channels', 'height' ], [ 'asc', 'desc' ]);
      redis.hSet(redisKey, {
        details: JSON.stringify({
          title: output.fulltitle,
          thumbnail: output.thumbnail,
          duration: output.duration_string,
          channel: output.channel,
          channelUrl: output.channel_url,
        }),
        formats: JSON.stringify(result),
      });
      redis.expire(redisKey, (60 * 60) * 2);
      resolve({
        details: {
          title: output.fulltitle,
          thumbnail: output.thumbnail,
          duration: output.duration_string,
          channel: output.channel,
          channelUrl: output.channel_url,
        },
        formats: result,
        raw: output,
      });
    }).catch((err:any) => {
      console.log(err);
      resolve({
        details: null,
        formats: [],
      });
    });
  });
};
