/// <reference types="vitest/config" />
import {defineConfig, loadEnv, type Plugin} from 'vite';
import {playwright} from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {checkSupabaseConfig} from './src/lib/check-supabase-config.ts';

/** Tests that run in jsdom instead of a browser (see `test` below). */
const UNIT_TESTS = 'src/**/*.unit.{test,spec}.{ts,tsx}';

/**
 * Adds a Content-Security-Policy <meta> tag to production builds. The same
 * build runs on Netlify and inside Electron, so one policy covers both. Dev
 * builds are left alone because Vite's HMR client needs inline scripts.
 */
function contentSecurityPolicy(supabaseUrl: string | undefined): Plugin {
  const connectSources = ["'self'"];

  if (supabaseUrl) {
    const supabase = new URL(supabaseUrl);

    // REST and auth over HTTPS. The app uses no realtime, so no WebSocket.
    connectSources.push(supabase.origin);
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

/**
 * Fails a production build whose Supabase settings would break the app or
 * bundle a secret key (see src/lib/check-supabase-config.ts).
 */
function supabaseConfigCheck(env: Record<string, string>): Plugin {
  return {
    name: 'cdm-optimiser:supabase-config',
    apply: 'build',
    buildStart() {
      const problems = checkSupabaseConfig(
        env.VITE_SUPABASE_URL,
        env.VITE_SUPABASE_PUBLISHABLE_KEY
      );

      if (problems.length > 0) {
        this.error(`Supabase settings: ${problems.join(' ')}`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_');

  return {
    // Absolute asset URLs, so pages at any path (`/pending-patients`) load
    // `/assets/…`. Netlify and the desktop app's app:// protocol both serve
    // the build from the root and answer unknown paths with index.html.
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      supabaseConfigCheck(env),
      contentSecurityPolicy(env.VITE_SUPABASE_URL),
    ],
    // Fixed port: `yarn dev:desktop` waits for this URL before starting Electron.
    server: {
      port: 5173,
      strictPort: true,
    },
    // Tests sit next to the code they test, in src/. Files named
    // `*.unit.test.ts(x)` run in jsdom; every other `*.test.ts(x)` file (such
    // as `header-component.test.tsx`) runs in a real browser.
    test: {
      projects: [
        {
          test: {
            include: [UNIT_TESTS],
            name: 'unit',
            environment: 'jsdom',
          },
        },
        {
          // Inherit the plugins above (React, Tailwind), so the stylesheets
          // loaded by the setup file are compiled as in the app.
          extends: true,
          test: {
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
            exclude: [UNIT_TESTS],
            name: 'browser',
            setupFiles: ['./src/test/browser-setup.ts'],
            browser: {
              enabled: true,
              provider: playwright(),
              instances: [{browser: 'chromium'}],
            },
          },
        },
      ],
    },
  };
});
