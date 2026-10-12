import { LocaleSwitch, ThemeSwitch } from '@react/design-system/components';
import { cn } from '@react/design-system/utils';
import type { JSX } from 'react';

import { NavLink } from '#/components';
import { AuthControls } from '#/features/auth/components';
import { authClient } from '#/integrations/betterAuth/authClient';
import { useLocale } from '#/integrations/i18n/LocaleProvider';
import { m } from '#/integrations/i18n/paraglide/messages';
import { locales } from '#/integrations/i18n/paraglide/runtime';

export function Header(): JSX.Element {
  const { locale, changeLocale } = useLocale();
  const { data: session, isPending } = authClient.useSession();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 shrink-0 px-4',
        'border-b border-stroke-primary',
        'bg-(--surface-header) backdrop-blur-lg',
      )}
    >
      <nav
        aria-label='Main navigation'
        className={cn(
          'mx-auto grid w-[min(1080px,calc(100%-2rem))] grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-3 sm:py-4 md:grid-cols-[1fr_auto_1fr]',
        )}
      >
        <div
          className={cn(
            'order-3 flex flex-wrap items-center gap-x-4 gap-y-1 pb-1 md:order-0 md:flex-nowrap md:pb-0',
            'text-sm font-semibold',
          )}
        >
          <NavLink to='/'>{m['nav.home']()}</NavLink>
          <NavLink to='/about'>{m['nav.about']()}</NavLink>
        </div>
        <div
          className={cn(
            'order-4 justify-self-center pb-1 md:order-0 md:pb-0',
            'text-sm font-semibold',
          )}
        >
          {!isPending && session?.user.role === 'admin' && (
            <NavLink to='/internal/users'>{m['nav.users']()}</NavLink>
          )}
        </div>
        <div
          className={cn(
            'col-span-2 flex items-center justify-self-end gap-1.5 sm:gap-2 md:col-span-1',
          )}
        >
          <AuthControls />
          <LocaleSwitch
            ariaLabel={m.languageLabel()}
            locales={locales}
            onValueChange={(locale) => {
              changeLocale({
                locale,
              });
            }}
            value={locale}
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
