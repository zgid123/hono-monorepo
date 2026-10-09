/** biome-ignore-all lint/style/useNamingConvention: Environment variable and binding names are platform-defined. */

import { Container } from '@cloudflare/containers';

interface IEnv {
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_USER: string;
  PGSSLMODE?: string;
  DB_PASSWORD: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD?: string;
  BETTER_AUTH_URL?: string;
  ALLOWED_ORIGINS?: string;
  BETTER_AUTH_SECRET: string;
  SERVER_CONTAINER: DurableObjectNamespace<ServerContainer>;
}

export class ServerContainer extends Container<IEnv> {
  sleepAfter = '10m';
  defaultPort = 3_000;
  envVars = {
    PORT: '3000',
    NODE_ENV: 'production',
    DB_HOST: this.env.DB_HOST,
    DB_PORT: this.env.DB_PORT,
    DB_NAME: this.env.DB_NAME,
    DB_USER: this.env.DB_USER,
    DB_PASSWORD: this.env.DB_PASSWORD,
    ...(this.env.PGSSLMODE
      ? {
          PGSSLMODE: this.env.PGSSLMODE,
        }
      : {}),
    ADMIN_EMAIL: this.env.ADMIN_EMAIL,
    BETTER_AUTH_SECRET: this.env.BETTER_AUTH_SECRET,
    ...(this.env.ADMIN_PASSWORD
      ? {
          ADMIN_PASSWORD: this.env.ADMIN_PASSWORD,
        }
      : {}),
    ...(this.env.BETTER_AUTH_URL
      ? {
          BETTER_AUTH_URL: this.env.BETTER_AUTH_URL,
        }
      : {}),
    ...(this.env.ALLOWED_ORIGINS
      ? {
          ALLOWED_ORIGINS: this.env.ALLOWED_ORIGINS,
        }
      : {}),
  };
}

export default {
  fetch(request: Request, env: IEnv): Promise<Response> {
    return env.SERVER_CONTAINER.getByName('server').fetch(request);
  },
};
