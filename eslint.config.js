import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import {defineConfig, globalIgnores} from 'eslint/config';

export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '.yarn',
    'apps/desktop/release',
    'apps/desktop/renderer',
    '**/coverage',
    '**/playwright-report',
    '**/test-results',
  ]),

  // Node.js scripts and configs: Electron main process, repo scripts.
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {globals: globals.node},
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {sourceType: 'commonjs'},
  },

  // React renderer code (web app).
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // TODO(bug-fix plan): newer eslint-plugin-react-hooks flags
      // `loadPatients()` in an effect (apps/web/src/api/patientsProvider.tsx),
      // the duplicate-fetch issue. Restore to 'error' once that is fixed.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);
