import { createServerFn } from '@tanstack/react-start';
import {
  getRequestHeader,
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

  const { data } = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie,
      },
    },
  });

  return data;
});
