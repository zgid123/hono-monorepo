import '#/infrastructure/common/loadEnv';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  dropSchema,
  setupSchema,
  truncateData,
} from '@alphacifer/drizzle/core';
import { testSchema } from '@alphacifer/drizzle/testing';

import { drizzle } from '#/infrastructure/drizzle/instance';

beforeAll(async () => {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const migrationsFolder = resolve(
    currentDir,
    '../infrastructure/drizzle/migrations',
  );

  await setupSchema({
    drizzle,
    migrationsFolder,
    schema: testSchema,
    client: drizzle.$client,
  });
});

afterAll(async () => {
  await dropSchema({
    schema: testSchema,
    client: drizzle.$client,
  });
});

afterEach(async () => {
  await truncateData({
    drizzle,
    schema: testSchema,
  });
});
