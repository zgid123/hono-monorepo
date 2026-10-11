import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

import {
  deLocalizeUrl,
  localizeUrl,
} from './integrations/i18n/paraglide/runtime';
import { getQueryContext } from './integrations/tanstackQuery/context';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const context = getQueryContext();

  const router = createTanStackRouter({
    context,
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: context.queryClient,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
