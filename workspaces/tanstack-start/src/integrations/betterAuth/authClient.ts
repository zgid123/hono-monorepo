import { createAuthClient } from 'better-auth/react';

const authBaseURL = import.meta.env.VITE_BETTER_AUTH_URL;

if (!authBaseURL) {
  throw new Error(
    'VITE_BETTER_AUTH_URL must point to the server auth endpoint',
  );
}

export const authClient = createAuthClient({
  baseURL: authBaseURL,
});
