import type { BetterAuthClientOptions } from 'better-auth/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

const additionalFields = inferAdditionalFields({
  user: {
    role: {
      type: 'string',
      input: false,
    },
  },
});

interface IAuthClientOptions extends BetterAuthClientOptions {
  plugins: [typeof additionalFields];
}

export const authClient: ReturnType<
  typeof createAuthClient<IAuthClientOptions>
> = createAuthClient<IAuthClientOptions>({
  basePath: '/api/v1/auth',
  baseURL: import.meta.env.VITE_AUTH_API,
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [additionalFields],
});
