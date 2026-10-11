import { cn } from '@react/shadcn-ui/lib/utils';
import { Globe } from 'lucide-react';
import type { JSX } from 'react';

import { type ISelectProps, Select } from '../Select/Select';

export interface ILocaleSwitchProps<TLocale extends string = string>
  extends Omit<
    ISelectProps<TLocale>,
    | 'options'
    | 'leftAddon'
    | 'placeholder'
    | 'contentProps'
    | 'itemClassName'
    | 'onValueChange'
  > {
  ariaLabel?: string;
  className?: string;
  locales: readonly TLocale[];
  onValueChange?: (locale: TLocale) => void;
}

export function LocaleSwitch<TLocale extends string = string>({
  locales,
  className,
  onValueChange,
  ariaLabel = 'Select language',
  defaultValue = 'en' as TLocale,
  ...rest
}: ILocaleSwitchProps<TLocale>): JSX.Element {
  const options = locales.map((locale) => {
    return {
      value: locale,
      label: locale.toUpperCase(),
    };
  });

  return (
    <Select
      ariaLabel={ariaLabel}
      className={cn(
        'h-8 w-fit gap-2 px-3',
        'cursor-pointer',
        'rounded-full border-stroke-primary',
        'bg-tertiary dark:bg-tertiary',
        'text-xs font-semibold tracking-wide text-foreground-primary',
        'transition-colors',
        'hover:bg-(--surface-hover) dark:hover:bg-(--surface-hover)',
        className,
      )}
      contentProps={{
        align: 'end',
        className: cn('min-w-24 p-1', 'rounded-xl'),
        alignItemWithTrigger: false,
      }}
      defaultValue={defaultValue}
      itemClassName={cn(
        'py-2 pr-8 pl-3',
        'cursor-pointer',
        'rounded-lg',
        'text-xs font-semibold tracking-wide',
      )}
      leftAddon={
        <Globe
          aria-hidden='true'
          className={cn('size-4', 'text-foreground-secondary')}
        />
      }
      onValueChange={(value) => {
        if (value !== null) {
          onValueChange?.(value);
        }
      }}
      options={options}
      placeholder=''
      {...rest}
    />
  );
}
