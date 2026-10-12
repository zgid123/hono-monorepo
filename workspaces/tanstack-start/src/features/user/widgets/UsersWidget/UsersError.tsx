import { cn } from '@react/design-system/utils';
import type { JSX } from 'react';

import { m } from '#/integrations/i18n/paraglide/messages';

export function UsersError(): JSX.Element {
  return (
    <p className={cn('text-sm text-destructive')} role='alert'>
      {m['page.users.loadError']()}
    </p>
  );
}
