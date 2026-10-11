import { cn } from '@react/shadcn-ui/lib/utils';
import type { HTMLAttributes, JSX } from 'react';

export interface IPanelProps extends HTMLAttributes<HTMLElement> {}

export function Panel({
  children,
  className,
  ...rest
}: IPanelProps): JSX.Element {
  return (
    <section
      className={cn(
        'flex flex-col gap-3 p-[clamp(1.25rem,4vw,2rem)]',
        'rounded-[1.25rem] border border-stroke-primary',
        'bg-[linear-gradient(165deg,var(--secondary),var(--surface-subtle))]',
        'shadow-[inset_0_1px_0_var(--inset-glint),0_18px_34px_var(--shadow-palm),0_4px_14px_var(--shadow-foreground-soft)] backdrop-blur-xs',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
