import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter} from 'react-router';
import './reset.css';
import './index.css';
import {App} from './app/app.tsx';
import {queryClient} from './app/query-client.ts';
import {redirectLegacyHashRoute} from './lib/redirect-legacy-hash-route.ts';

redirectLegacyHashRoute(window.location, window.history);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
