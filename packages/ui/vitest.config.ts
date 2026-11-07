import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    name: 'ui',
    // Tests sit next to the component they test, e.g.
    // src/components/alert.component.test.tsx.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // Loads Tailwind, so tests and the Vitest UI show the real styles.
    setupFiles: ['./test/setup.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{browser: 'chromium'}],
    },
  },
});
