import { useEffect, useState } from 'react';

import type { IThemeSwitchProps, TThemeMode } from './ThemeSwitch';

const THEME_STORAGE_KEY = 'theme';

function getInitialMode(): TThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyThemeMode(mode: TThemeMode): void {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(mode);
  document.documentElement.setAttribute('data-theme', mode);
  document.documentElement.style.colorScheme = mode;
}

interface IUseThemeSwitchParams
  extends Pick<
    IThemeSwitchProps,
    | 'checked'
    | 'defaultChecked'
    | 'ariaLabel'
    | 'aria-label'
    | 'onCheckedChange'
  > {}

interface IUseThemeSwitchResult {
  isDark: boolean;
  label: string;
  onCheckedChange: NonNullable<IThemeSwitchProps['onCheckedChange']>;
}

export function useThemeSwitch({
  checked,
  defaultChecked,
  ariaLabel,
  'aria-label': ariaLabelAttr,
  onCheckedChange,
}: IUseThemeSwitchParams): IUseThemeSwitchResult {
  const [mode, setMode] = useState<TThemeMode>(
    defaultChecked ? 'dark' : 'light',
  );
  const isControlled = checked !== undefined;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    const initialMode: TThemeMode =
      defaultChecked !== undefined
        ? defaultChecked
          ? 'dark'
          : 'light'
        : getInitialMode();
    setMode(initialMode);
    applyThemeMode(initialMode);
  }, [defaultChecked, isControlled]);

  const isDark = isControlled ? checked : mode === 'dark';
  const resolvedMode: TThemeMode = isDark ? 'dark' : 'light';
  const nextMode: TThemeMode = isDark ? 'light' : 'dark';
  const resolvedAriaLabel =
    typeof ariaLabel === 'function'
      ? ariaLabel({
          nextMode,
          mode: resolvedMode,
        })
      : (ariaLabel ?? ariaLabelAttr);
  const label =
    resolvedAriaLabel ??
    `Theme mode: ${resolvedMode}. Click to switch to ${nextMode} mode.`;

  const handleCheckedChange: NonNullable<
    IThemeSwitchProps['onCheckedChange']
  > = (nextChecked, eventDetails) => {
    if (!isControlled) {
      const nextMode: TThemeMode = nextChecked ? 'dark' : 'light';
      setMode(nextMode);
      applyThemeMode(nextMode);
      window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    }

    onCheckedChange?.(nextChecked, eventDetails);
  };

  return {
    label,
    isDark,
    onCheckedChange: handleCheckedChange,
  };
}
