import { cn } from '@react/design-system/utils';
import { createRootRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

import { authClient } from '#/integrations/betterAuth/authClient';
import { BasicLayout } from '#/layouts';

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    return {
      session,
    };
  },
  component: RootComponent,
});

function RootComponent(): JSX.Element {
  return (
    <div
      className={cn(
        'm-0 flex min-w-dvw min-h-dvh flex-col overflow-x-hidden',
        'bg-[radial-gradient(1100px_620px_at_-8%_-10%,var(--lagoon-glow),transparent_58%),radial-gradient(1050px_620px_at_112%_-12%,var(--palm-glow),transparent_62%),radial-gradient(720px_380px_at_50%_115%,color-mix(in_oklab,var(--lagoon)_10%,transparent),transparent_68%),linear-gradient(180deg,color-mix(in_oklab,var(--sand)_68%,var(--color-white))_0%,var(--foam)_44%,var(--primary)_100%)]',
        'font-sans text-foreground-primary antialiased wrap-anywhere',
        'selection:bg-lagoon/24',
        "before:pointer-events-none before:fixed before:inset-0 before:-z-1 before:content-['']",
        'before:bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--color-white)_80%,transparent),transparent_34%),radial-gradient(circle_at_78%_26%,color-mix(in_oklab,var(--lagoon)_20%,transparent),transparent_42%),radial-gradient(circle_at_42%_82%,color-mix(in_oklab,var(--palm)_14%,transparent),transparent_36%)] before:opacity-28',
        "after:pointer-events-none after:fixed after:inset-0 after:-z-1 after:content-['']",
        'after:bg-[linear-gradient(color-mix(in_srgb,var(--color-white)_7%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--color-white)_6%,transparent)_1px,transparent_1px)] after:bg-size-[28px_28px] after:opacity-14',
        'after:mask-[radial-gradient(circle_at_50%_30%,black,transparent_78%)]',
      )}
    >
      <BasicLayout />
    </div>
  );
}
