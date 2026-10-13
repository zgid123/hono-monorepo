import { createServerFn } from '@tanstack/react-start';
import {
  getRequestHeader,
  getResponseHeaders,
  setResponseHeader,
} from '@tanstack/react-start/server';

import { authClient } from './authClient';

export type TAuthSession = typeof authClient.$Infer.Session | null;

export const getSession = createServerFn({
  method: 'GET',
}).handler(async (): Promise<TAuthSession> => {
  setResponseHeader('Cache-Control', 'private, no-store');

  const cookie = getRequestHeader('cookie');

  if (!cookie) {
    return null;
  }

  const { data, error } = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie,
      },
      onSuccess({ response }): void {
        const cookies = response.headers.getSetCookie();

        if (cookies.length > 0) {
          setResponseHeader('Set-Cookie', [
            ...getResponseHeaders().getSetCookie(),
            ...cookies,
          ]);
        }
      },
    },
  });

  if (error) {
    throw new Error('Unable to retrieve the current session');
  }

  return data;
});
