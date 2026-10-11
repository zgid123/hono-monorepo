import { cn } from '@react/design-system/utils';
import { Outlet } from '@tanstack/react-router';
import type { JSX } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

export function BasicLayout(): JSX.Element {
  return (
    <div className={cn('flex min-h-dvh flex-col overflow-x-clip')}>
      <Header />
      <main
        className={cn(
          'mx-auto flex w-[min(1080px,calc(100%-2rem))] flex-1 flex-col py-12',
        )}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
