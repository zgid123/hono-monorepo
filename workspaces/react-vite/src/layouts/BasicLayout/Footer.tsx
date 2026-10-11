import { cn } from '@react/design-system/utils';
import type { JSX } from 'react';

export function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'shrink-0 px-4 pt-10 pb-14',
        'border-t border-stroke-primary',
        'text-foreground-secondary',
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-[min(1080px,calc(100%-2rem))] flex-col items-center justify-between gap-4 sm:flex-row',
          'text-center sm:text-left',
        )}
      >
        <p className={cn('m-0', 'text-sm')}>
          &copy; {year} Alpha. All rights reserved.
        </p>
        <p
          className={cn(
            'm-0',
            'text-[0.69rem] font-bold tracking-[0.16em] text-(--foreground-kicker) uppercase',
          )}
        >
          Built with React + Vite
        </p>
      </div>
    </footer>
  );
}
