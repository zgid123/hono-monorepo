import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: {
      label: '@core/utils',
      color: 'blue',
    },
    globals: true,
    include: ['src/**/__tests__/**/*.spec.ts'],
  },
});
