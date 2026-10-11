import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: '@node/hono',
    globals: true,
    include: ['src/__tests__/**/*.e2e.ts'],
  },
});
