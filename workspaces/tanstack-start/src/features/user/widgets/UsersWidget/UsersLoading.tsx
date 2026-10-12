import { cn } from '@react/design-system/utils';
import type { JSX } from 'react';

import { m } from '#/integrations/i18n/paraglide/messages';

export function UsersLoading(): JSX.Element {
  return (
    <p className={cn('text-sm text-muted-foreground')}>
      {m['page.users.loading']()}
    </p>
  );
}
