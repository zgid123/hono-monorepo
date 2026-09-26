import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: {
      label: '@domain/auth',
      color: 'blue',
    },
    globals: true,
    include: ['src/**/__tests__/**/*.spec.ts'],
  },
});
