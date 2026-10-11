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
        'text-[0.69rem] font-bold text-(--foreground-kicker) uppercase tracking-[0.16em]',
        className,
      )}
    >
      {children}
    </p>
  );
}
