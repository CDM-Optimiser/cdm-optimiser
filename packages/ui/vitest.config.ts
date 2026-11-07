import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'ui',
    // Tests sit next to the component they test, e.g.
    // src/components/alert.component.test.tsx.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{browser: 'chromium'}],
    },
  },
});
