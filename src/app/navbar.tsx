'use client';
import React, { useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { set } from '@/features/monitor/tabSelectedSlice';

export default function App() {
  const [ isMenuOpen, setIsMenuOpen ] = React.useState(false);

  const menuItems = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Tools',
      path: '/tools',
    },
    {
      name: 'Servers',
      path: '/servers',
    },
  ];

  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(set(localStorage.getItem('selectedTabs') as string));
  }, [ dispatch ]);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className='select-none' isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
          id='menu-toggle'
        />
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <p className="font-bold text-inherit">XYRUS10</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem {...{ isActive: path === '/' }}>
          <Link href="/">
            Home
          </Link>
        </NavbarItem>
        {/* <NavbarItem>
          <Link href="/tools">
            Tools
          </Link>
        </NavbarItem> */}
        <Dropdown>
          <NavbarItem {...{ isActive: path.includes('/tools') }}>
            <DropdownTrigger className='cursor-pointer'>
              Tools
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="Tools"
            className="w-[340px]"
            itemClasses={{
              base: 'gap-4',
            }}
          >
            <DropdownItem
              key="monitor"
              description="Simple System Monitor"
              startContent={''}
              onClick={() => router.push('/tools/monitor')}
            >
              Monitor
            </DropdownItem>
            <DropdownItem
              key="monitor"
              description="Youtube audio and video downloader"
              startContent={''}
              onClick={() => router.push('/tools/youtube')}
            >
              Youtube Downloader
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem {...{ isActive: path.includes('/servers') }}>
          <Link href="/servers">
            Servers
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? 'primary' : index === menuItems.length - 1 ? 'danger' : 'foreground'
              }
              className="w-full"
              href={item.path}
              onClick={() => {
                const btn = document.getElementById('menu-toggle');
                btn?.click();
              }}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
