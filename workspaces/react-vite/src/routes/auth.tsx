import { cn } from '@react/design-system/utils';
import { createFileRoute, redirect } from '@tanstack/react-router';
import type { JSX } from 'react';

import { AuthFormWidget } from '#/features/auth/widgets';
import { authClient } from '#/integrations/betterAuth/authClient';

export interface IAuthSearch {
  mode?: 'signUp';
}

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>): IAuthSearch => {
    return {
      mode: search.mode === 'signUp' ? 'signUp' : undefined,
    };
  },
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (session) {
      throw redirect({
        to: '/',
        replace: true,
      });
    }
  },
  component: Auth,
});

function Auth(): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-[1_0_auto] items-center justify-center',
        'text-foreground-primary',
      )}
    >
      <AuthFormWidget />
    </div>
  );
}
