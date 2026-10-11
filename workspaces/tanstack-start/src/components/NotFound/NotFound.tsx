import { Panel } from '@react/design-system/components';
import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

import { m } from '#/integrations/i18n/paraglide/messages';

export function NotFound(): JSX.Element {
  return (
    <main>
      <Panel>
        <p className='text-sm font-semibold text-foreground-secondary'>404</p>
        <h1 className='font-display text-4xl font-bold text-foreground-primary sm:text-5xl'>
          {m['page.notFound.title']()}
        </h1>
        <p className='text-base leading-8 text-foreground-secondary'>
          {m['page.notFound.content']()}
        </p>
        <Link className='underline underline-offset-4' to='/'>
          {m['nav.home']()}
        </Link>
      </Panel>
    </main>
  );
}
