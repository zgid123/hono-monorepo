import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@react/shadcn-ui/components/input-group';
import { cn } from '@react/shadcn-ui/lib/utils';
import type { InputHTMLAttributes, JSX, ReactNode, RefAttributes } from 'react';

export interface IInputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    RefAttributes<HTMLInputElement> {
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  containerClassName?: string;
}

export function Input({
  disabled,
  leftAddon,
  className,
  rightAddon,
  containerClassName,
  ...rest
}: IInputProps): JSX.Element {
  const hasAddon = Boolean(leftAddon || rightAddon);

  return (
    <InputGroup
      className={cn(
        'h-auto',
        'has-[[data-slot=input-group-control]:focus-visible]:ring-0',
        hasAddon
          ? cn(
              'rounded-xl border-stroke-primary',
              'bg-tertiary dark:bg-tertiary',
              'transition-[border-color,box-shadow,background-color] duration-180',
              'focus-within:border-stroke-tertiary focus-within:shadow-(--focus-shadow)',
              'has-[[data-slot=input-group-control]:focus-visible]:border-stroke-tertiary',
            )
          : cn(
              'border-0',
              'dark:bg-transparent',
              'has-disabled:bg-transparent dark:has-disabled:bg-transparent',
              'has-[[data-slot][aria-invalid=true]]:ring-0',
            ),
        containerClassName,
      )}
      data-disabled={disabled}
    >
      {leftAddon && (
        <InputGroupAddon align='inline-start'>{leftAddon}</InputGroupAddon>
      )}
      <InputGroupInput
        className={cn(
          'h-auto px-[0.9rem] py-[0.7rem]',
          'text-foreground-primary md:text-base',
          !hasAddon &&
            cn(
              'rounded-xl border border-stroke-primary',
              'bg-tertiary dark:bg-tertiary',
              'transition-[border-color,box-shadow,background-color] duration-180',
              'focus:border-stroke-tertiary focus:shadow-(--focus-shadow)',
              'focus-visible:border-stroke-tertiary',
            ),
          className,
        )}
        disabled={disabled}
        {...rest}
      />
      {rightAddon && (
        <InputGroupAddon align='inline-end'>{rightAddon}</InputGroupAddon>
      )}
    </InputGroup>
  );
}
