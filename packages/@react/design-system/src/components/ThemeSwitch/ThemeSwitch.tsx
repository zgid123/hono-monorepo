import { Switch as ShadcnSwitch } from '@react/shadcn-ui/components/switch';
import { cn } from '@react/shadcn-ui/lib/utils';
import { Moon, Sun } from 'lucide-react';
import type { ComponentProps, JSX } from 'react';

import { useThemeSwitch } from './hooks';

export type TThemeMode = 'light' | 'dark';

export interface IThemeSwitchLabelParams {
  mode: TThemeMode;
  nextMode: TThemeMode;
}

export interface IThemeSwitchProps
  extends Omit<ComponentProps<typeof ShadcnSwitch>, 'children' | 'size'> {
  ariaLabel?: string | ((params: IThemeSwitchLabelParams) => string);
}

export function ThemeSwitch({
  title,
  checked,
  ariaLabel,
  className,
  defaultChecked,
  onCheckedChange,
  'aria-label': ariaLabelAttr,
  ...rest
}: IThemeSwitchProps): JSX.Element {
  const {
    isDark,
    label,
    onCheckedChange: handleCheckedChange,
  } = useThemeSwitch({
    checked,
    ariaLabel,
    defaultChecked,
    onCheckedChange,
    'aria-label': ariaLabelAttr,
  });

  return (
    <span className={cn('relative inline-flex items-center', className)}>
      <ShadcnSwitch
        aria-label={label}
        checked={isDark}
        className={cn(
          'p-1',
          'cursor-pointer border-0',
          'bg-black data-checked:bg-black data-unchecked:bg-black dark:data-unchecked:bg-black',
          'data-[size=default]:h-8 data-[size=default]:w-16',
          '**:data-[slot=switch-thumb]:z-10 **:data-[slot=switch-thumb]:size-6',
          '**:data-[slot=switch-thumb]:bg-neutral-100 dark:**:data-[slot=switch-thumb]:bg-neutral-100',
          '**:data-[slot=switch-thumb]:duration-200',
          '**:data-[slot=switch-thumb]:data-checked:translate-x-8',
        )}
        onCheckedChange={handleCheckedChange}
        title={title ?? label}
        {...rest}
      />
      <Moon
        aria-hidden='true'
        className={cn(
          'absolute left-2 size-4',
          'pointer-events-none',
          'text-yellow-400',
          'transition-all duration-200',
          'peer-data-checked:scale-100 peer-data-checked:opacity-100',
          'peer-data-unchecked:scale-75 peer-data-unchecked:opacity-0',
          'peer-data-disabled:opacity-50',
        )}
      />
      <Sun
        aria-hidden='true'
        className={cn(
          'absolute right-2 size-4',
          'pointer-events-none',
          'text-amber-500',
          'transition-all duration-200',
          'peer-data-checked:scale-75 peer-data-checked:opacity-0',
          'peer-data-unchecked:scale-100 peer-data-unchecked:opacity-100',
          'peer-data-disabled:opacity-50',
        )}
      />
    </span>
  );
}
