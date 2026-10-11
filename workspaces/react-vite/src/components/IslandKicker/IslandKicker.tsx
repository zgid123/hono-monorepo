import { cn } from '@react/design-system/utils';
import type { JSX, ReactNode } from 'react';

interface IIslandKickerProps {
  className?: string;
  children: ReactNode;
}

export function IslandKicker({
  children,
  className,
}: IIslandKickerProps): JSX.Element {
  return (
    <p
      className={cn(
        'text-[0.69rem] font-bold tracking-[0.16em] text-(--foreground-kicker) uppercase',
        className,
      )}
    >
      {children}
    </p>
  );
}
