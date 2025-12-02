/// <reference types="vitest/config" />
import path from 'path';
import {defineConfig} from 'vite';
import {playwright} from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  plugins: [react(), tailwindcss()],
  test: {
    projects: [
      {
        test: {
          include: [
            'tests/unit/**/*.{test,spec}.ts',
            'tests/unit/**/*.component.{test,spec}.ts',
            'tests/**/*.unit.{test,spec}.ts',
            'tests/**/*.component.unit.{test,spec}.ts',
          ],
          name: 'unit',
          environment: 'jsdom',
        },
      },
      {
        test: {
          include: [
            'tests/browser/**/*.{test,spec}.ts',
            'tests/browser/**/*.component.{test,spec}.ts',
            'tests/**/*.browser.{test,spec}.ts',
            'tests/**/*.component.browser.{test,spec}.ts',
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
});
