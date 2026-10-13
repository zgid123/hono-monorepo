import { Avatar, Button, toast } from '@react/design-system/components';
import { cn } from '@react/design-system/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import type { JSX } from 'react';

import { authClient } from '#/integrations/betterAuth/authClient';
import { useLocale } from '#/integrations/i18n/LocaleProvider';
import { m } from '#/integrations/i18n/paraglide/messages';

export function AuthControls(): JSX.Element {
  useLocale();

  const { data: session, isPending } = authClient.useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

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
      <div className='flex items-center gap-2'>
        <Avatar name={session.user.name} src={session.user.image} />
        <Button
          onClick={async () => {
            const { error } = await authClient.signOut();

            if (error) {
              toast.error(error.message);

              return;
            }

            queryClient.clear();

            await router.navigate({
              to: '/auth',
              replace: true,
            });
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
