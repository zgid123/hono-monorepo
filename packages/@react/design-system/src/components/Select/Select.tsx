import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from '@react/shadcn-ui/components/select';
import { cn } from '@react/shadcn-ui/lib/utils';
import type { ComponentProps, JSX, ReactNode } from 'react';

export interface ISelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

export interface ISelectProps<TValue extends string = string>
  extends Omit<
    ComponentProps<typeof ShadcnSelect<TValue>>,
    'children' | 'items' | 'multiple'
  > {
  className?: string;
  ariaLabel?: string;
  placeholder?: string;
  leftAddon?: ReactNode;
  itemClassName?: string;
  options?: ISelectOption<TValue>[];
  contentProps?: Omit<ComponentProps<typeof SelectContent>, 'children'>;
}

export function Select<TValue extends string = string>({
  className,
  ariaLabel,
  leftAddon,
  contentProps,
  options = [],
  itemClassName,
  placeholder = 'Select an option',
  ...rest
}: ISelectProps<TValue>): JSX.Element {
  return (
    <ShadcnSelect items={options} {...rest}>
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          'h-10 w-full px-3',
          'rounded-xl border-stroke-primary',
          'bg-tertiary dark:bg-tertiary',
          'text-foreground-primary',
          className,
        )}
      >
        {leftAddon}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align='start' {...contentProps}>
        {options.map(({ label, value }) => {
          return (
            <SelectItem className={itemClassName} key={value} value={value}>
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </ShadcnSelect>
  );
}
