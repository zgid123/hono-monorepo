import { Button as ShadcnButton } from '@react/shadcn-ui/components/button';
import { cn } from '@react/shadcn-ui/lib/utils';
import { cva, type VariantProps } from 'cva';
import type { ButtonHTMLAttributes, JSX } from 'react';

export const buttonVariants = cva({
  base: cn(
    'inline-flex items-center justify-center relative',
    'gap-2 shrink-0 overflow-hidden',
    'font-medium text-sm transition-all duration-200 text-white',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
    'disabled:pointer-events-none disabled:opacity-50',
  ),
  variants: {
    variant: {
      default: cn('bg-primary', 'hover:opacity-90', 'shadow-sm'),
    },
    size: {
      sm: cn('rounded-xl', 'px-3 py-1.5'),
      md: cn('rounded-xl', 'px-4 py-2.5'),
      lg: cn('rounded-2xl', 'px-6 py-4', 'text-base'),
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  size,
  variant,
  className,
  ...rest
}: IButtonProps): JSX.Element {
  return (
    <ShadcnButton
      className={cn(
        buttonVariants({
          size,
          variant,
        }),
        className,
      )}
      {...rest}
    />
  );
}
