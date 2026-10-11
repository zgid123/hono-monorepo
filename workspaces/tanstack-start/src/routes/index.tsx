import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage(): JSX.Element {
  return <main className='flex-1' />;
}
