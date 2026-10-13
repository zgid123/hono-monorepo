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

const authBaseUrl = import.meta.env.SSR
  ? process.env.BETTER_AUTH_URL
  : import.meta.env.VITE_BETTER_AUTH_URL;

if (!authBaseUrl) {
  throw new Error(
    'Set BETTER_AUTH_URL for the server and VITE_BETTER_AUTH_URL for the browser auth endpoint',
  );
}

export const authClient: ReturnType<
  typeof createAuthClient<IAuthClientOptions>
> = createAuthClient<IAuthClientOptions>({
  baseURL: authBaseUrl,
  plugins: [additionalFields],
});
