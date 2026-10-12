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

const authBaseURL = import.meta.env.VITE_BETTER_AUTH_URL;

if (!authBaseURL) {
  throw new Error(
    'VITE_BETTER_AUTH_URL must point to the server auth endpoint',
  );
}

export const authClient: ReturnType<
  typeof createAuthClient<IAuthClientOptions>
> = createAuthClient<IAuthClientOptions>({
  baseURL: authBaseURL,
  plugins: [additionalFields],
});
