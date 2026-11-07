import type {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter} from 'react-router';
import {render} from 'vitest-browser-react';

/**
 * Renders inside a fresh QueryClient (no retries, so errors show at once)
 * and a MemoryRouter. Returns the client too, to inspect the cache.
 */
export async function renderWithProviders(ui: ReactNode, {path = '/'} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}, mutations: {retry: false}},
  });

  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );

  return {screen, queryClient};
}
