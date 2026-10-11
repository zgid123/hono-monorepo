import { cn } from '@react/design-system/utils';
import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import type { JSX, ReactNode } from 'react';

import { NotFound } from '#/components';
import { getLocale } from '#/integrations/i18n/paraglide/runtime';
import { BasicLayout } from '#/layouts';

import TanStackQueryDevtools from '../integrations/tanstackQuery/devtools';
import appCss from '../styles.css?url';

export interface IMyRouterContext {
  queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<IMyRouterContext>()({
  beforeLoad: async () => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale());
    }
  },
  head: () => {
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'TanStack Start',
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
      ],
    };
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

interface IRootDocumentProps {
  children: ReactNode;
}

function RootDocument({ children }: IRootDocumentProps): JSX.Element {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore
          dangerouslySetInnerHTML={{
            __html: THEME_INIT_SCRIPT,
          }}
        />
        <HeadContent />
      </head>
      <body
        className={cn(
          'm-0 flex min-h-dvh flex-col overflow-x-hidden',
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
        <BasicLayout>{children}</BasicLayout>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
