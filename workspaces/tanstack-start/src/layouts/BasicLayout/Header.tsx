import { LocaleSwitch, ThemeSwitch } from '@react/design-system/components';
import type { JSX } from 'react';

import { NavLink } from '#/components';
import { AuthControls } from '#/features/auth/components';
import { m } from '#/integrations/i18n/paraglide/messages';
import {
  getLocale,
  locales,
  setLocale,
} from '#/integrations/i18n/paraglide/runtime';

export function Header(): JSX.Element {
  return (
    <header className='sticky top-0 z-50 shrink-0 border-b border-stroke-primary bg-(--surface-header) px-4 backdrop-blur-lg'>
      <nav className='mx-auto flex w-[min(1080px,calc(100%-2rem))] flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4'>
        <div className='order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-0 sm:w-auto sm:flex-nowrap sm:pb-0'>
          <NavLink to='/'>{m['nav.home']()}</NavLink>
          <NavLink to='/about'>{m['nav.about']()}</NavLink>
        </div>
        <div className='ml-auto flex items-center gap-1.5 sm:gap-2'>
          <AuthControls />
          <LocaleSwitch
            ariaLabel={m.languageLabel()}
            locales={locales}
            onValueChange={(locale) => setLocale(locale)}
            value={getLocale()}
          />
          <ThemeSwitch
            ariaLabel={({ mode, nextMode }) => {
              return m.themeLabel({
                mode,
                nextMode,
              });
            }}
          />
        </div>
      </nav>
    </header>
  );
}
