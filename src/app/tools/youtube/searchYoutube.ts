'use server';

import * as yt from 'youtube-search-without-api-key';

export const searchVideo = async (search: string) => {
  return await yt.search(search);
};
