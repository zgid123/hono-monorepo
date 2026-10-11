import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return <div />;
}
