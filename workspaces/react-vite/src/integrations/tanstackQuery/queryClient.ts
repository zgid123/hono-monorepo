import { MutationCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (_error, _variables, _context, mutation) => {
      if (!mutation.options?.meta?.manual) {
        // TODO: add default error handling
      }
    },
  }),
});
