import { cn } from '@react/design-system/utils';
import { createFileRoute } from '@tanstack/react-router';
import { type JSX, Suspense } from 'react';

import { getUsersQueryOptions } from '#/features/user/queries';
import { UsersError, UsersLoading, UsersWidget } from '#/features/user/widgets';
import { m } from '#/integrations/i18n/paraglide/messages';

export const Route = createFileRoute('/internal/users')({
  loader: async ({ context }) => {
    await context.queryClient.query(
      getUsersQueryOptions({
        page: 1,
        limit: 10,
      }),
    );
  },
  pendingComponent: UsersLoading,
  errorComponent: UsersError,
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return (
    <section className={cn('flex flex-col gap-6')}>
      <h1>{m['page.users.title']()}</h1>
      <Suspense fallback={<UsersLoading />}>
        <UsersWidget />
      </Suspense>
    </section>
  );
}
