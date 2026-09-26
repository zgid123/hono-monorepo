import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: {
      label: '@contracts/core',
      color: 'cyan',
    },
    globals: true,
    include: ['src/**/__tests__/**/*.spec.ts'],
  },
});
