import './styles.css';

import { Toaster } from '@react/design-system/components';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import type { JSX } from 'react';

import { LocaleProvider } from '#/integrations/i18n/LocaleProvider';
import { queryClient } from '#/integrations/tanstackQuery/queryClient';

import { routeTree } from '../routeTree.gen';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
  },
});

export function App(): JSX.Element {
  return (
    <LocaleProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </LocaleProvider>
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    title?: string;
  }
}
