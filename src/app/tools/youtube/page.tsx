'use client';

import { Input, Button, Select, SelectItem } from '@nextui-org/react';
import { getFormats } from './getFormats';
import { Video } from './type';
import { useRef, useState } from 'react';
import { formatBytes } from '@/helper/Function';
import { Image } from '@nextui-org/react';

const YoutubPage = () => {
  const [ formats, setFormats ] = useState<Video['formats']>([]);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ details, setDetails ] = useState<Video['details']>(null);
  const formatSelected = useRef<HTMLSelectElement | null>(null);

  const getData = async (url: string) => {
    setLoading(true);
    setDetails(null);
    setFormats([]);
    const video = await getFormats(url);
    setDetails(video.details);
    setFormats(video.formats);
    setLoading(false);
  };

  return (
    <div className="flex justify-center flex-col">
      <h1 className="text-2xl text-center my-5">Youtube Video Downloader</h1>
      <div className="flex flex-col items-center gap-6">
        <Input
          className='bg-inherit lg:w-6/12 md:w-6/12 sm:w-6/12 text-center'
          label="Youtube URL"
          variant='underlined'
          labelPlacement="outside"
          type="text"
          onPaste={async (e) => {
            getData(e.clipboardData.getData('text/plain'));
          }}
          onKeyUp={async (e) => {
            if (e.key === 'Enter') {
              getData(e.currentTarget.value);
            }
          }}
        />
        <div className='flex gap-4'>
          <Image src={details?.thumbnail} alt="" className='max-w-[200px] max-h-[200px]' />
          <div>
            <p>{details?.title} {details?.duration ? ` - (${details?.duration})` : ''}</p>
            <p onClick={() => window.open(details?.channelUrl, '_blank')} className='cursor-pointer'>{details?.channel}</p>
          </div>
        </div>
        <Select
          ref={formatSelected}
          label={formats.length > 0 ? 'Select Format' : 'Formats'}
          className="border-none lg:w-3/12 md:w-6/12 sm:w-6/12 text-center"
          variant='underlined'
          isLoading={loading}
        >
          {formats.map((format, index) => (
            <SelectItem key={format.url} value={format.url} className="text-center">
              {`${format.format_note} ${format.audio_channels > 0 ? '' : '(Muted)'} - ${format.filesize ? formatBytes(format.filesize) : formatBytes(format.filesize_approx)}`}
            </SelectItem>
          ))}
        </Select>
        <Button
          disabled={formatSelected.current?.value == null}
          onClick={() => {
            const selected = formatSelected.current?.value;
            console.log(formatSelected.current?.value);

            if (selected) {
              window.open(selected, '_blank');
            }
          }}
        >Download</Button>
      </div>
    </div>
  );
};

export default YoutubPage;
