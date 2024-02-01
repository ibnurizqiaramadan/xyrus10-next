'use server';

import { Video } from './type';
import { create } from 'youtube-dl-exec';
import _ from 'lodash';
const youtubedl = create('yt-dlp');

/**
 * Filters the formats to retrieve only those with the 'mp4' extension
 * and not from 'manifest.googlevideo.com'.
 *
 * @param {any} output - the output object containing formats
 * @return {Array} the filtered array of formats
 */
const checkFormat = (output:any): Array<any> => {
  return output.formats.filter((x:any) =>
    x.ext === 'mp4' && !String(x.url).includes('manifest.googlevideo.com')
  );
};

/**
 * Retrieves video formats from the given URL.
 *
 * @param {string} url - The URL of the video
 * @return {Promise<Video>} A Promise that resolves with video details and formats
 */
export const getFormats = (url: string): Promise<Video> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<Video>(async (resolve, reject) => {
    youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
    }).then((output:any) => {
      if (!output) {
        return resolve({ details: null, formats: [] });
      }
      const filter = checkFormat(output);
      if (filter.length == 0) return [];
      const result = _.orderBy(filter, [ 'audio_channels', 'height' ], [ 'asc', 'desc' ]);
      resolve({
        details: {
          title: output.fulltitle,
          thumbnail: output.thumbnail,
          duration: output.duration_string,
          channel: output.channel,
          channelUrl: output.channel_url,
        },
        formats: result,
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
