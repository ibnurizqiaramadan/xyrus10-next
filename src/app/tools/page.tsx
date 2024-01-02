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
      <meta name="description" content="Tools that I use 123121212" />
      <>

        <Button className='mt-2 bg-slate-700'>
          <Link href="/tools/monitor">Monitor</Link>
        </Button>
      </>
    </>
  );
}
