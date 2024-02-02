'use client';

import { Input, Button, Select, SelectItem } from '@nextui-org/react';
import { getFormats } from './getFormats';
import { Video } from './type';
import { useEffect, useRef, useState } from 'react';
import { formatBytes } from '@/helper/Function';
import { Image } from '@nextui-org/react';
import React from 'react';
import { searchVideo } from './searchYoutube';
import { useSearchParams, useRouter } from 'next/navigation';

const YoutubPage = (): React.JSX.Element => {
  const params = useRouter();
  const [ formats, setFormats ] = useState<Video['formats']>([]);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ details, setDetails ] = useState<Video['details']>(null);
  const formatSelected = useRef<HTMLSelectElement | null>(null);
  const inputText = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const [ videoIdInput, setVideoIdInput ] = useState<string>(videoId ?? '');
  const [ inputValue, setInputValue ] = useState<string>('');

  useEffect(() => {
    if (videoId) {
      getData(`https://youtube.com/watch?v=${videoId}`);
      setInputValue(`https://www.youtube.com/watch?v=${videoId}`);
      setVideoIdInput('');
      params.replace('/tools/youtube');
    }
  }, [ params, videoId, videoIdInput ]);

  /**
   * Fetches data from the specified URL and updates the state accordingly.
   *
   * @param {string} url - the URL to fetch data from
   * @return {Promise<void>} a Promise that resolves when the data is fetched and the state is updated
   */
  const getData = async (url: string): Promise<void> => {
    setLoading(true);
    setDetails(null);
    setFormats([]);
    formatSelected.current?.removeAttribute('value');
    const video = await getFormats(url);
    setDetails(video.details);
    setFormats(video.formats);
    setLoading(false);
  };

  return (
    <div className="flex justify-center flex-col select-none">
      <title>Youtube Video and Audio Downloader</title>
      <h1 className="text-2xl text-center my-5">Youtube Downloader</h1>
      <div className="flex flex-col items-center">
        <div className='lg:w-8/12 md:w-8/12 sm:w-8/12 w-full flex flex-col gap-6'>
          <Input
            ref={inputText}
            className='bg-inherit text-center'
            label="Youtube video title or video URL"
            variant='underlined'
            labelPlacement="outside"
            type="text"
            inputMode='search'
            value={videoIdInput.trim() != '' ? `https://www.youtube.com/watch?v=${videoIdInput}` : inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={async (e) => {
              getData(e.clipboardData.getData('text/plain'));
            }}
            onKeyUp={async (e) => {
              if (e.key === 'Enter') {
                const input: string = e.currentTarget.value;
                if (input.trim() == '') return;
                if (input.startsWith('https://')) return getData(input);
                setLoading(true);
                setDetails(null);
                setFormats([]);
                const data = await searchVideo(e.currentTarget.value);
                getData(data[0].url);
              }
            }}
          />
          <div className='flex flex-col items-center gap-4'>
            <Image src={details?.thumbnail} alt="" className='w-full max-h-[250px] object-cover ' loading='lazy'/>
            <div>
              <p onClick={() => window.open(details?.channelUrl, '_blank')} className='cursor-pointer font-bold text-2xl'>{details?.channel}</p>
              <p>{details?.title} {details?.duration ? ` - (${details?.duration})` : ''}</p>
            </div>
          </div>
          <Select
            ref={formatSelected}
            label={formats.length > 0 ? 'Select Format' : 'Formats'}
            className="border-none text-center"
            variant='underlined'
            isLoading={loading}
          >
            {formats.map((format, index) => (
              <SelectItem key={format.url} value={format.url} className="text-center">
                {`${format.ext == 'mp4' ? `video ${format.format_note}` : format.format.split('-')[1]} ${format.audio_channels > 0 ? '' : '(Muted)'} - ${format.filesize ? formatBytes(format.filesize) : formatBytes(format.filesize_approx)}`}
              </SelectItem>
            ))}
          </Select>
          <Button
            className='w-1/2 self-center'
            disabled={formatSelected.current?.value == null}
            onClick={() => {
              const selected = formatSelected.current?.value;
              if (selected) {
                window.open(selected, '_blank');
              }
            }}
          >Download</Button>
        </div>
      </div>
    </div>
  );
};

export default YoutubPage;
