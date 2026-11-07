import {QueryClient} from '@tanstack/react-query';

/**
 * Server state for the whole app. Patient data stays in memory only (no
 * persistence) and is cleared on sign-out (see AuthProvider).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data counts as fresh for 30 s; after that it refetches when the
      // window regains focus, so another user's changes show up.
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
