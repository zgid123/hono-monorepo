import '#/infrastructure/common/loadEnv';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { migrate } from '@alphacifer/drizzle/core';

import { drizzle } from '#/infrastructure/drizzle/instance';
import { seed } from '#/infrastructure/drizzle/seeds';

const migrationsFolder = resolve(
  dirname(fileURLToPath(import.meta.url)),
  'infrastructure/drizzle/migrations',
);

try {
  await migrate(drizzle, {
    migrationsFolder,
    migrationsSchema: 'public',
    migrationsTable: 'orm_migrations',
  });

  await seed(drizzle);
} catch (error) {
  console.error('Database setup failed:', error);
  process.exitCode = 1;
} finally {
  await drizzle.$client.end();
}
