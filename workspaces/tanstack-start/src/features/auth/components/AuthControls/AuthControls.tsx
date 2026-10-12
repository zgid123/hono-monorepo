import { Avatar, Button } from '@react/design-system/components';
import { cn } from '@react/design-system/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import type { JSX } from 'react';

import { authClient } from '#/integrations/betterAuth/authClient';
import { useAuthSession } from '#/integrations/betterAuth/useAuthSession';
import { m } from '#/integrations/i18n/paraglide/messages';

export function AuthControls(): JSX.Element {
  const session = useAuthSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (session?.user) {
    return (
      <div className={cn('flex items-center gap-2')}>
        <Avatar name={session.user.name} src={session.user.image} />
        <Button
          onClick={async () => {
            const { error } = await authClient.signOut();

            if (error) {
              return;
            }

            await queryClient.cancelQueries({
              queryKey: ['users'],
            });

            queryClient.removeQueries({
              queryKey: ['users'],
            });

            await router.invalidate();
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
