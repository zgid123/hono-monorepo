import { Panel } from '@react/design-system/components';
import { cn } from '@react/design-system/utils';
import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

import { IslandKicker } from '#/components';
import { useLocale } from '#/integrations/i18n/LocaleProvider';
import { m } from '#/integrations/i18n/paraglide/messages';

export const Route = createFileRoute('/about')({
  component: About,
});

function About(): JSX.Element {
  useLocale();

  return (
    <div>
      <Panel>
        <IslandKicker>{m['nav.about']()}</IslandKicker>
        <h1
          className={cn(
            'font-display text-4xl font-bold text-foreground-primary sm:text-5xl',
          )}
        >
          {m['page.about.title']()}
        </h1>
        <p
          className={cn(
            'm-0 max-w-3xl',
            'text-base leading-8 text-foreground-secondary',
          )}
        >
          {m['page.about.content']()}
        </p>
      </Panel>
    </div>
  );
}
