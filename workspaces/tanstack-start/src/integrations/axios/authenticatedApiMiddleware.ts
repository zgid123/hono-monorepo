import { createMiddleware } from '@tanstack/react-start';
import {
  getRequestHeader,
  setResponseHeader,
} from '@tanstack/react-start/server';

import { createApiClient } from './apiClient';

export const authenticatedApiMiddleware = createMiddleware({
  type: 'function',
}).server(({ next }) => {
  setResponseHeader('Cache-Control', 'private, no-store');

  const baseUrl = process.env.API_URL;

  if (!baseUrl) {
    throw new Error('API_URL must point to the Hono server origin');
  }

  const cookie = getRequestHeader('cookie');

  if (!cookie) {
    throw new Error('Authentication required');
  }

  return next({
    context: {
      apiClient: createApiClient({
        cookie,
        baseUrl,
      }),
    },
  });
});
