import { Cqrsx } from '@cqrsx/core';
import { type ServerType, serve } from '@hono/node-server';
import { honoErrorHandler } from '@node/hono/handlers';
import {
  createDrizzleMiddleware,
  createWireMiddleware,
} from '@node/hono/middlewares';
import { detect } from 'detect-port';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { ExtractSchema } from 'hono/types';

import { allowedOrigins, env } from '#/infrastructure/common/env';
import { drizzle } from '#/infrastructure/drizzle/instance';

import type { TContext } from '../context';
import { wire } from '../wire';
import { endpoints } from './endpoints';

export type TApp = Hono<TContext, ExtractSchema<typeof endpoints>>;

export function createApp(): TApp {
  const cqrsx = new Cqrsx();

  const container = wire({
    cqrsx,
    drizzle,
  });

  return new Hono<TContext>()
    .use(
      cors({
        credentials: true,
        origin: allowedOrigins,
      }),
    )
    .use(
      createDrizzleMiddleware({
        drizzle,
      }),
    )
    .use(
      createWireMiddleware({
        wire: container,
      }),
    )
    .route('', endpoints)
    .onError(honoErrorHandler);
}

export async function startServer(): Promise<ServerType> {
  const app = createApp();
  const port =
    env.NODE_ENV === 'development' ? await detect(env.PORT) : env.PORT;

  const server = serve(
    {
      port,
      fetch: app.fetch,
    },
    ({ port }) => {
      console.log(`Server is running on http://localhost:${port}`);
    },
  );

  let shuttingDown = false;

  async function shutdown(): Promise<void> {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    const timeout = setTimeout(() => {
      console.error('Server shutdown timed out');
      process.exit(1);
    }, 8_000);

    timeout.unref();

    try {
      try {
        await new Promise<void>((resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          });
        });
      } finally {
        await drizzle.$client.end();
      }
    } catch (error) {
      console.error('Server shutdown failed:', error);
      process.exitCode = 1;
    } finally {
      clearTimeout(timeout);
    }
  }

  process.on('SIGTERM', () => {
    void shutdown();
  });

  process.on('SIGINT', () => {
    void shutdown();
  });

  return server;
}
