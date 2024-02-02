'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function YoutubWatchPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  const router = useRouter();
  useEffect(() => {
    router.replace(`/tools/youtube?v=${videoId}`);
  }, [ router, videoId ]);
  return (<></>);
}
