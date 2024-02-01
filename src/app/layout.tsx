import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './navbar';
import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Providers } from './providers';
import StoreProvider from '@/store/StoreProvider';
config.autoAddCss = false;

const inter = Inter({ subsets: [ 'latin' ] });

export const metadata: Metadata = {
  title: 'xyrus10\'s website',
  description: 'Under development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <html lang="en" className='dark'>
        <body className={inter.className + ''}>
          <NextTopLoader
            color='#64748B'
            crawl={true}
          />
          <Providers>
            <Navbar />
            {/* <NavbarSide /> */}
            <main className='lg:px-60 md:px-20 sm:px-10 p-5'>
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </StoreProvider>
  );
}
