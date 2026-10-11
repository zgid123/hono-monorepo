import { Button } from '@react/design-system/components';
import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

import { authClient } from '#/integrations/betterAuth/authClient';
import { m } from '#/integrations/i18n/paraglide/messages';

export function AuthControls(): JSX.Element {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className='h-8 w-8 bg-neutral-100 dark:bg-neutral-800 animate-pulse' />
    );
  }

  if (session?.user) {
    return (
      <div className='flex items-center gap-2'>
        {session.user.image ? (
          <img alt='' className='h-8 w-8' src={session.user.image} />
        ) : (
          <div className='h-8 w-8 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'>
            <span className='text-xs font-medium text-neutral-600 dark:text-neutral-400'>
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
