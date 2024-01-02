'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar(props:any) {
  const path = usePathname();

  return (
    (path == '/') && (
      <nav className="bg-gray-900 text-white p-4 fixed w-full top-0 select-none shadow-sm z-40">
        <div className="container px-10">
          <div className="flex items-center text-lg">
            <span className="font-bold">xyrus10</span>
            <div className="space-x-4 ml-4">
              <Link href="/" className={`${path === '/' ? ' text-gray-400' : ''}`}>Home</Link>
              {/* <Link href="/tools" className={`${path.includes('/tools') ? ' text-gray-400' : ''}`}>Tools</Link>
              <Link href="/servers" className={`${path === '/servers' ? ' text-gray-400' : ''}`}>Servers</Link> */}
              <Link href="/tools">Tools</Link>
              <Link href="/servers">Servers</Link>
            </div>
          </div>
        </div>
      </nav>
    )
  );
}
