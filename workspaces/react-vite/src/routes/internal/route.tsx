import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import type { JSX } from 'react';

export const Route = createFileRoute('/internal')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: '/auth',
      });
    }
  },
  component: InternalLayout,
});

function InternalLayout(): JSX.Element {
  return <Outlet />;
}
