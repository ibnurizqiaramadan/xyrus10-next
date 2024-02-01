type Format = {
  asr: number;
  filesize: number | null;
  format_id: string;
  format_note: string;
  source_preference: number;
  fps: number;
  audio_channels: number;
  height: number;
  quality: number;
  has_drm: boolean;
  tbr: number;
  url: string;
  width: number;
  language: string | null;
  language_preference: number;
  preference: string | null;
  ext: string;
  vcodec: string;
  acodec: string;
  dynamic_range: string;
  downloader_options: {
    http_chunk_size: number;
  };
  protocol: string;
  resolution: string;
  aspect_ratio: number;
  filesize_approx: number;
  http_headers: {
    'User-Agent': string;
    Accept: string;
    'Accept-Language': string;
    'Sec-Fetch-Mode': string;
  };
  video_ext: string;
  audio_ext: string;
  vbr: number | null;
  abr: number | null;
  format: string;
}

export type Video = {
  details: {
    title: string;
    channel: string;
    channelUrl: string;
    duration: string;
    thumbnail: string;
  } | null,
  formats: Format[]
}
