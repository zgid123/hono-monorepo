import { Button } from '@react/design-system/components';
import { cn } from '@react/design-system/utils';
import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

import { authClient } from '#/integrations/betterAuth/authClient';
import { useLocale } from '#/integrations/i18n/LocaleProvider';
import { m } from '#/integrations/i18n/paraglide/messages';

export function AuthControls(): JSX.Element {
  useLocale();

  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div
        className={cn(
          'h-8 w-8',
          'bg-neutral-100 dark:bg-neutral-800',
          'animate-pulse',
        )}
      />
    );
  }

  if (session?.user) {
    return (
      <div className={cn('flex items-center gap-2')}>
        {session.user.image ? (
          <img alt='' className={cn('h-8 w-8')} src={session.user.image} />
        ) : (
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center',
              'bg-neutral-100 dark:bg-neutral-800',
            )}
          >
            <span
              className={cn(
                'text-xs font-medium text-neutral-600 dark:text-neutral-400',
              )}
            >
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <Button
          onClick={() => {
            void authClient.signOut();
          }}
          type='button'
          variant='outline'
        >
          {m['auth.signOut']()}
        </Button>
      </div>
    );
  }

  return (
    <Button nativeButton={false} render={<Link to='/auth' />} variant='outline'>
      {m['auth.signIn']()}
    </Button>
  );
}
