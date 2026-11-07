import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router';
import './reset.css';
import './index.css';
import {App} from './app/app.tsx';
import {redirectLegacyHashRoute} from './lib/redirect-legacy-hash-route.ts';

redirectLegacyHashRoute(window.location, window.history);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
