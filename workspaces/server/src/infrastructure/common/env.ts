/** biome-ignore-all lint/style/useNamingConvention: ignore */
import arkenv from '@arkenv/core';

export const env = arkenv({
  ADMIN_EMAIL: 'string',
  ADMIN_PASSWORD: 'string?',
  PORT: 'number.port = 3000',
  ALLOWED_ORIGINS: 'string?',
  BETTER_AUTH_URL: 'string?',
  BETTER_AUTH_SECRET: 'string',
  NODE_ENV: "'development' | 'staging' | 'production' | 'test' = 'development'",
});
