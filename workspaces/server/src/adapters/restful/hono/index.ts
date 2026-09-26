import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { migrate } from '@alphacifer/drizzle/core';
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

import { env } from '#/infrastructure/common/env';
import { drizzle } from '#/infrastructure/drizzle/instance';
import { seed as drizzleSeed } from '#/infrastructure/drizzle/seeds';

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
        origin: env.ALLOWED_ORIGINS?.split(',') ?? [],
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

export async function initInfra(): Promise<void> {
  const migrationsFolder = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '../../../infrastructure/drizzle/migrations',
  );

  await migrate(drizzle, {
    migrationsFolder,
    migrationsSchema: 'public',
    migrationsTable: 'orm_migrations',
  });

  await drizzleSeed(drizzle);
}

export async function startServer(): Promise<ServerType> {
  const app = createApp();

  return serve(
    {
      fetch: app.fetch,
      port: await detect(env.PORT),
    },
    ({ port }) => {
      console.log(`Server is running on http://localhost:${port}`);
    },
  );
}
