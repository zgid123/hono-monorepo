import type { JSX } from 'react';

import { IslandKicker } from '#/components';

export function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className='shrink-0 border-t border-stroke-primary px-4 pb-14 pt-10 text-foreground-secondary'>
      <div className='mx-auto flex w-[min(1080px,calc(100%-2rem))] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left'>
        <p className='m-0 text-sm'>&copy; {year} Alpha. All rights reserved.</p>
        <IslandKicker className='m-0'>Built with TanStack Start</IslandKicker>
      </div>
    </footer>
  );
}
