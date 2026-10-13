import { useRouteContext } from '@tanstack/react-router';

import type { TAuthSession } from './getSession';

export function useAuthSession(): TAuthSession {
  const { session } = useRouteContext({
    from: '__root__',
  });

  return session;
}
