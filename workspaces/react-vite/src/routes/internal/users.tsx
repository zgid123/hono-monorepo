import { cn } from '@react/design-system/utils';
import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

import { UsersWidget } from '#/features/user/widgets';
import { useLocale } from '#/integrations/i18n/LocaleProvider';
import { m } from '#/integrations/i18n/paraglide/messages';

export const Route = createFileRoute('/internal/users')({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  useLocale();

  return (
    <section className={cn('flex flex-col gap-6')}>
      <h1>{m['page.users.title']()}</h1>
      <UsersWidget />
    </section>
  );
}
