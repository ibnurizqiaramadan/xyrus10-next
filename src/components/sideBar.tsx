'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

// eslint-disable-next-line no-undef
export default function SideBar(props: {
  open: boolean,
  header: string | React.ReactNode,
  list: {
    name: string | React.ReactNode,
    path: string
  }[]
}) {
  const path:string = usePathname();

  return (
    <aside className={`
      bg-gray-900
      text-white
      select-none
      hidden 
      md:block
      md:fixed
      md:h-full
      md:w-60
      md:left-0
      md:top-0
      md:pt-5
      md:overflow-auto
      ${props.open === true && `
        `}
      `}>
      <div className='px-6 text-center'>
        <Link href={`/${path.split('/')[1]}`} className='text-2xl'>{props.header}</Link>
        <hr className='mt-4 mb-6 border-gray-600' />
      </div>
      <div className="flex flex-col">
        {props.list?.map((item, index) => (
          <Link
            key={`${item.path}-${index}`}
            href={item.path}
            className={`pr-6 pl-4 py-3 ml-6 text-lg rounded-tl-xl rounded-bl-xl ${path == item.path && 'bg-slate-800'}`}>{item.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
