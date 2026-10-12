import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import type { JSX } from 'react';

export const Route = createFileRoute('/internal')({
  beforeLoad: ({ context }) => {
    if (!context.session?.user) {
      throw redirect({
        to: '/auth',
      });
    }
  },
  headers: () => {
    return {
      'Cache-Control': 'private, no-store',
    };
  },
  component: InternalLayout,
});

function InternalLayout(): JSX.Element {
  return <Outlet />;
}
