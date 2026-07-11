/** biome-ignore-all lint/style/useNamingConvention: ignore */
import arkenv from 'arkenv';

export const env = arkenv({
  ADMIN_EMAIL: 'string',
  ADMIN_PASSWORD: 'string?',
  PORT: 'number.port = 3000',
  ALLOWED_ORIGINS: 'string?',
  BETTER_AUTH_URL: 'string?',
  BETTER_AUTH_SECRET: 'string',
  JWT_PUBLIC_KEY_PATH: 'string',
  JWT_PRIVATE_KEY_PATH: 'string',
  NODE_ENV: "'development' | 'staging' | 'production' | 'test' = 'development'",
});
