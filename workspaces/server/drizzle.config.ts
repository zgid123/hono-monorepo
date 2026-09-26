import { config } from '@alphacifer/drizzle/config';

const drizzleConfig = config({
  out: './src/infrastructure/drizzle/migrations',
  rootFolder: ['src/modules/auth/infrastructure/drizzle'],
});

export default drizzleConfig;
