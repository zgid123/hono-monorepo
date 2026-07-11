import { passwordHash, verifyPassword } from '@alphacifer/authkit/hash';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { drizzle } from '#/infrastructure/drizzle/instance';
import { accounts } from '#/infrastructure/drizzle/schemas/accounts';
import { sessions } from '#/infrastructure/drizzle/schemas/sessions';
import { users } from '#/infrastructure/drizzle/schemas/users';
import { verifications } from '#/infrastructure/drizzle/schemas/verifications';

export const auth = betterAuth({
  basePath: '/api/v1/auth',
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(drizzle, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: (password: string) => {
        return passwordHash({
          password,
        });
      },
      verify: ({ hash, password }) => {
        return verifyPassword({
          password,
          hashPassword: hash,
        });
      },
    },
  },
  advanced: {
    cookiePrefix: 'hono-monorepo',
    database: {
      generateId: 'uuid',
    },
  },
});

export type TBetterAuth = typeof auth;
