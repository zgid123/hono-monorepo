import { migrate } from '@alphacifer/drizzle/core';
import { onError } from '@alphacifer/hono/core';
import { Cqrsx } from '@cqrsx/core';
import { type ServerType, serve } from '@hono/node-server';
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

interface IInitHonoReturn {
  app: TApp;
  server: ServerType;
}

interface IInitHonoParams {
  beforeInitRoutes?: (app: TApp) => void;
}

export async function initHono({
  beforeInitRoutes,
}: IInitHonoParams = {}): Promise<IInitHonoReturn> {
  const app = new Hono<TContext>();
  const isTest = !!process.env.VITEST_WORKER_ID;

  if (!isTest) {
    await migrate(drizzle, {
      migrationsSchema: 'public',
      migrationsTable: 'orm_migrations',
      migrationsFolder: './src/infrastructure/drizzle/migrations',
    });

    await drizzleSeed(drizzle);
  }

  const cqrsx = new Cqrsx();

  const container = wire({
    cqrsx,
    drizzle,
  });

  app
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
    );

  beforeInitRoutes?.(app);

  app.route('', endpoints).onError((error, c) => {
    return onError(error, c);
  });

  const server = serve(
    {
      fetch: app.fetch,
      port: await detect(
        isTest ? 6_000 + Number(process.env.VITEST_WORKER_ID) : 3_000,
      ),
    },
    ({ port }) => {
      console.log(`Server is running on http://localhost:${port}`);
    },
  );

  return {
    app,
    server,
  };
}
