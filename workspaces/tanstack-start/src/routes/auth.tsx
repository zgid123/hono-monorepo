import { createFileRoute, redirect } from '@tanstack/react-router';
import type { JSX } from 'react';

import { AuthFormWidget } from '#/features/auth/widgets';

export interface IAuthSearch {
  mode?: 'signUp';
}

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>): IAuthSearch => {
    return {
      mode: search.mode === 'signUp' ? 'signUp' : undefined,
    };
  },
  beforeLoad: ({ context }) => {
    if (context.session?.user) {
      throw redirect({
        to: '/',
        replace: true,
      });
    }
  },
  headers: () => {
    return {
      'Cache-Control': 'private, no-store',
    };
  },
  component: Auth,
});

function Auth(): JSX.Element {
  return (
    <main className='flex flex-[1_0_auto] items-center justify-center text-foreground-primary'>
      <AuthFormWidget />
    </main>
  );
}
