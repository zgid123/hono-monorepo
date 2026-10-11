import { Button as ShadcnButton } from '@react/shadcn-ui/components/button';
import { cn } from '@react/shadcn-ui/lib/utils';
import { cva, type VariantProps } from 'cva';
import type { ComponentProps, JSX } from 'react';

export const buttonVariants = cva({
  base: cn(
    'h-auto gap-2 overflow-hidden',
    'cursor-pointer',
    'text-[0.9rem] font-bold leading-none text-foreground-primary',
    'transition-[background-color,color,border-color,transform] duration-180 ease-[ease]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/50',
    'disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0',
  ),
  variants: {
    size: {
      sm: cn('rounded-xl', 'px-3 py-1.5'),
      md: cn('rounded-[0.85rem]', 'px-4 py-[0.72rem]'),
      lg: cn('rounded-2xl', 'px-6 py-4', 'text-base'),
    },
    variant: {
      default: cn(
        'border border-(--action-border)',
        'bg-(--action-background)',
        'hover:-translate-y-px hover:bg-(--action-hover-background)',
      ),
      outline: cn(
        'border border-stroke-secondary',
        'bg-(--surface-header)',
        'font-medium text-lagoon-deep',
        'hover:bg-(--surface-hover) hover:text-lagoon-deep',
      ),
      ghost: cn(
        'p-0',
        'rounded-none border-0 bg-transparent',
        'text-sm font-normal text-foreground-secondary',
        'hover:bg-transparent hover:text-foreground-primary',
        'active:not-aria-[haspopup]:translate-y-0',
        'disabled:opacity-100',
      ),
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface IButtonProps
  extends Omit<ComponentProps<typeof ShadcnButton>, 'size' | 'variant'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loaderText?: string;
}

export function Button({
  size,
  variant,
  children,
  disabled,
  className,
  loaderText,
  isLoading = false,
  'aria-busy': ariaBusy,
  ...rest
}: IButtonProps): JSX.Element {
  return (
    <ShadcnButton
      aria-busy={isLoading || ariaBusy}
      className={cn(
        buttonVariants({
          size,
          variant,
        }),
        className,
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className={cn('flex items-center justify-center gap-2')}>
          <span
            aria-hidden='true'
            className={cn(
              'h-4 w-4',
              'rounded-full border-2 border-neutral-400 border-t-white dark:border-neutral-600 dark:border-t-neutral-900',
              'animate-spin',
            )}
          />
          <span>{loaderText ?? children}</span>
        </span>
      ) : (
        children
      )}
    </ShadcnButton>
  );
}
