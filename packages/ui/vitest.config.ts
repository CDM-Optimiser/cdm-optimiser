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
      // Reduced motion: drawers appear at once instead of sliding in, so
      // clicks never land on something still moving.
      provider: playwright({contextOptions: {reducedMotion: 'reduce'}}),
      instances: [{browser: 'chromium'}],
    },
  },
});
