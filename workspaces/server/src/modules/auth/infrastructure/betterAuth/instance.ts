import { passwordHash, verifyPassword } from '@alphacifer/authkit/hash';
import { USER_PASSWORD_MAX_LENGTH } from '@contracts/auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins/admin';

import { drizzle } from '#/infrastructure/drizzle/instance';

import { accounts } from '../drizzle/schemas/accounts';
import { sessions } from '../drizzle/schemas/sessions';
import { users } from '../drizzle/schemas/users';
import { verifications } from '../drizzle/schemas/verifications';

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
    maxPasswordLength: USER_PASSWORD_MAX_LENGTH,
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
  user: {
    additionalFields: {
      displayName: {
        type: 'string',
        required: false,
      },
    },
  },
  plugins: [
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
  ],
  advanced: {
    cookiePrefix: 'hono-monorepo',
    database: {
      generateId: 'uuid',
    },
  },
});

export type TBetterAuth = typeof auth;
