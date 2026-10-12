import { useRouteContext } from '@tanstack/react-router';

import { authClient } from './authClient';
import type { TAuthSession } from './getSession';

export function useAuthSession(): TAuthSession {
  const { session: initialSession } = useRouteContext({
    from: '__root__',
  });

  authClient.hydrateSession(initialSession);

  const { data, isPending, isRefetching } = authClient.useSession();

  return isPending && !isRefetching ? initialSession : data;
}
