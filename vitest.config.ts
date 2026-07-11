import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/**/vitest.config.ts',
      'workspaces/**/vitest.config.ts',
    ],
    coverage: {
      exclude: ['workspaces/server/src/infrastructure/drizzle/seeds'],
    },
  },
});
