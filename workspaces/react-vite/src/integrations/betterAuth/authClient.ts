import { createAuthClient } from 'better-auth/react';

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    basePath: '/api/v1/auth',
    baseURL: import.meta.env.VITE_AUTH_API,
    fetchOptions: {
      credentials: 'include',
    },
    plugins: [],
  },
);
