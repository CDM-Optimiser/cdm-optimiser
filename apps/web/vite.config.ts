/// <reference types="vitest/config" />
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import {playwright} from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

/**
 * Adds a Content-Security-Policy <meta> tag to production builds. The same
 * build runs on Netlify and inside Electron, so one policy covers both. Dev
 * builds are left alone because Vite's HMR client needs inline scripts.
 */
function contentSecurityPolicy(supabaseUrl: string | undefined): Plugin {
  const connectSources = ["'self'"];

  if (supabaseUrl) {
    const supabase = new URL(supabaseUrl);

    // REST and auth over HTTPS; realtime over a WebSocket on the same host.
    connectSources.push(supabase.origin, `wss://${supabase.host}`);
  }

  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    // React sets `style` attributes (e.g. the alert progress bar width).
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src ${connectSources.join(' ')}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  return {
    name: 'cdm-optimiser:content-security-policy',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: {'http-equiv': 'Content-Security-Policy', content: policy},
        injectTo: 'head-prepend',
      },
    ],
  };
}

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    contentSecurityPolicy(loadEnv(mode, __dirname, 'VITE_').VITE_SUPABASE_URL),
  ],
  // Fixed port: `yarn dev:desktop` waits for this URL before starting Electron.
  server: {
    port: 5173,
    strictPort: true,
  },
  test: {
    projects: [
      {
        test: {
          include: [
            'tests/unit/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.unit.{test,spec}.{ts,tsx}',
            'tests/**/*.component.unit.{test,spec}.{ts,tsx}',
          ],
          name: 'unit',
          environment: 'jsdom',
        },
      },
      {
        test: {
          include: [
            'tests/browser/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.browser.{test,spec}.{ts,tsx}',
            'tests/**/*.component.browser.{test,spec}.{ts,tsx}',
          ],
          name: 'browser',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{browser: 'chromium'}],
          },
        },
      },
    ],
  },
}));
