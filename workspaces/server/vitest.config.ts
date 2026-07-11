import { defineProject } from 'vitest/config';

export default defineProject({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    name: {
      label: 'server',
      color: 'cyan',
    },
    globals: true,
    setupFiles: ['src/__tests__/setup.ts'],
    include: ['src/**/__tests__/**/*.{spec,e2e}.ts'],
  },
});
