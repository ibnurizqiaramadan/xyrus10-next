'use client';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ToolsPage() {
  useEffect(() => {
    console.log('Tools Page');
  }, []);
  return (
    <>
      <title>Tools that I use</title>
      <meta name="description" content="Tools that I use" />
      <div className='flex gap-3'>
        <Button className='mt-2 bg-slate-700'>
          <Link href="/tools/monitor">Monitor</Link>
        </Button>
        <Button className='mt-2 bg-slate-700'>
          <Link href="/tools/youtube">Youtube Video Downloader</Link>
        </Button>
      </div>
    </>
  );
}
