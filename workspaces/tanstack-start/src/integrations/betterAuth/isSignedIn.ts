import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';

import { authClient } from './authClient';

export const isSignedIn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const cookie = getRequestHeader('cookie');

    if (!cookie) {
      return false;
    }

    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: {
          cookie,
        },
      },
    });

    return Boolean(session?.user);
  },
);
