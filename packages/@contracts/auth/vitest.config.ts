import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: {
      label: '@contracts/auth',
      color: 'magenta',
    },
    globals: true,
    include: ['src/**/__tests__/**/*.spec.ts'],
  },
});
