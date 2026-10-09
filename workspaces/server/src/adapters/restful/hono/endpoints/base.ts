import { Hono } from 'hono';

import { env } from '#/infrastructure/common/env';

export const baseEndpoints = new Hono().get('/health', (c) => {
  return c.json({
    message: 'Ok!',
    version: env.APP_VERSION,
  });
});
