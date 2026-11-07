# CDM Optimiser

A dashboard that helps Irish GP practices find patients who are eligible for
the Chronic Disease Management (CDM) programme but not yet enrolled, and track
who accepted or refused. One React app ships to two targets:

- **Web:** `apps/web`, deployed to Netlify.
- **Desktop:** `apps/desktop`, an Electron app installed on premises in
  clinics. It packages the same web build; it has no UI of its own.

Data and authentication come from Supabase. The app handles **patient health
data**: follow the privacy rules in `.claude/instructions.md`.

## Repository map

| Path           | Package                  | Contents                                                                                                                   |
| -------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`     | `@cdm-optimiser/web`     | React 19 + Vite + Tailwind 4 SPA. Entry `src/main.tsx`, routes `src/App.tsx`, Supabase client `src/utils/api/supabase.ts`. |
| `apps/desktop` | `@cdm-optimiser/desktop` | Electron main process `src/main.js`, preload `src/preload.cjs`, packaging config `electron-builder.yml`.                   |
| `scripts/`     | (root)                   | Changed-files helpers behind `yarn prettier` and `yarn linc`.                                                              |
| `.github/`     | (root)                   | `ci.yml` (checks on every PR), `release-desktop.yml` (Windows installer on `v*` tags).                                     |

## Commands

Yarn 4 only: `npm`, `npx` and `pnpm` are denied in `.claude/settings.json`.
Use `yarn dlx` where you would use `npx`.

```sh
nvm use && corepack enable   # once per machine: Node 24 from .nvmrc, then Yarn 4.18.1
yarn install

yarn dev:web                 # web app on http://localhost:5173
yarn dev:desktop             # Electron window on the Vite dev server

yarn test                    # Vitest component tests (browser mode, Chromium)
yarn build:web               # production build to apps/web/dist
yarn test:e2e                # Playwright smoke test against the build
yarn typecheck               # tsc -b across the workspaces
yarn lint                    # ESLint, whole repo   (yarn linc: changed files only)
yarn format                  # Prettier, whole repo (yarn prettier: changed files only)

yarn dist:desktop            # Windows installer in apps/desktop/release
```

## Architecture rules

- **HashRouter and Vite `base: './'` are required.** The same build loads from
  `file://` inside Electron. Don't switch to `BrowserRouter` or absolute asset
  paths.
- **Desktop loads the web build.** `yarn build:renderer` (desktop workspace)
  writes the web build to `apps/desktop/renderer/`, which `main.js` loads. In
  development `main.js` loads `VITE_DEV_SERVER_URL` instead.
- **One process boundary.** The renderer reaches Electron only through
  `window.darkMode`, exposed by `preload.cjs` and typed in
  `apps/web/src/utils/types/electron.d.ts`. Change the IPC handler in
  `main.js`, the preload and the types together.
- **The web app must also work in a plain browser,** where `window.darkMode`
  doesn't exist.
- **Configuration** comes from `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` in `apps/web/.env.local` (copy `.env.example`).
  They are bundled into the client, so only the anon key belongs there.

## Pinned versions

- Node 24 (`.nvmrc`), matching the Node inside Electron.
- TypeScript stays below 6.1, because typescript-eslint doesn't support
  TypeScript 7 yet.
- Electron is pinned to an exact version, which electron-builder requires.

@.claude/instructions.md
