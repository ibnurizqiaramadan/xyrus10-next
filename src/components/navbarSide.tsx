'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import SideBar from './sideBar';

export default function NavbarSide(props: {
  header?: string | React.ReactNode,
  list?: {
    name: string | React.ReactNode,
    path: string
  }[]
}) {
  const path = usePathname();

  const [ open, setOpen ] = useState(true);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    path != '/' && (
      <div>
        <nav className="bg-gray-900 text-white
        fixed
        w-full
        p-4
        sm:ml-0
        md:ml-60
        top-0
        select-none shadow-sm z-40">
          <div className="container">
            <div className="flex items-center text-lg">
              <span className="font-bold cursor-pointer"> <FontAwesomeIcon icon={faBars} onClick={toggleSidebar}></FontAwesomeIcon></span>
              <div className="space-x-4 ml-4">
                <Link href="/">Home</Link>
                <Link href="/tools" className={`${path.includes('/tools') ? ' text-gray-400' : ''}`}>Tools</Link>
                <Link href="/servers" className={`${path.includes('/servers') ? ' text-gray-400' : ''}`}>Servers</Link>
              </div>
            </div>
          </div>
        </nav>
        <SideBar
          open={open}
          header={props.header}
          list={props.list as any}
        />
      </div>
    )
  );
}
