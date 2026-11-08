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

| Path                      | Package                         | Contents                                                                                                                                                  |
| ------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`                | `@cdm-optimiser/web`            | React 19 + Vite + Tailwind 4 SPA. Entry `src/main.tsx`, routes `src/app/app.tsx`, Supabase client `src/lib/supabase.ts`.                                  |
| `apps/desktop`            | `@cdm-optimiser/desktop`        | Electron main process `src/main.ts`, updater `src/updater.ts`, preload `src/preload.cts`, packaging and update config `electron-builder.yml`.             |
| `packages/ui`             | `@cdm-optimiser/ui`             | Presentational components (alert, button, card, dropdown, menu button, modal, switch, text field), icons and their hooks. Consumed as TypeScript source.  |
| `packages/desktop-bridge` | `@cdm-optimiser/desktop-bridge` | Types-only IPC contract shared by the Electron main process, the preload and the web app (`src/index.d.ts`).                                              |
| `scripts/`                | (root)                          | Changed-files helpers behind `yarn prettier` and `yarn linc`; `yarn bump` and `yarn check:versions`.                                                      |
| `.github/`                | (root)                          | `ci.yml` (checks on every PR), `installer-check.yml` (Windows installer on desktop PRs), `release.yml` (a GitHub Release for each new version on `main`). |

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
yarn test:e2e                # Playwright smoke and accessibility tests against the build
yarn typecheck               # tsc -b across the workspaces
yarn lint                    # ESLint, whole repo   (yarn linc: changed files only)
yarn format                  # Prettier, whole repo (yarn prettier: changed files only)

yarn dist:desktop            # Windows installer in apps/desktop/release
yarn bump <x.y.z>            # set the app version; merging it publishes a release
```

## Architecture rules

- **Routes are real paths** (`BrowserRouter`, Vite `base: '/'`), so every
  server must answer unknown paths with `index.html`: Netlify does it with
  the redirect in `netlify.toml`, the desktop app in its `app://` protocol
  handler. Old `/#/…` links are turned into paths on start-up
  (`lib/redirect-legacy-hash-route.ts`).
- **Desktop loads the web build.** `yarn build:renderer` (desktop workspace)
  writes the web build to `apps/desktop/renderer/`. The main process serves it
  on `app://cdm-optimiser/`, never from `file://`; in development it loads
  `VITE_DEV_SERVER_URL` instead. That scheme and host are the page's origin,
  which holds the Supabase session: changing them signs users out. `tsc -b`
  compiles `apps/desktop/src` to `apps/desktop/dist`.
- **One process boundary.** The renderer reaches Electron only through
  `window.darkMode` and `window.appUpdates`, exposed by the preload. The contract (channels, payloads,
  `Window` typing) lives in `packages/desktop-bridge`; change it first, then
  `main.ts` and `preload.cts`, and the compiler flags any mismatch.
- **The web app must also work in a plain browser,** where `window.darkMode`
  and `window.appUpdates` don't exist. They are typed as optional, so the
  compiler asks for the check.
- **Releases and updates:** one version (root `package.json`, `yarn bump`).
  Merging a version bump publishes a GitHub Release, and installed desktop
  apps update from it (electron-updater in the main process). See "Deploys
  and releases" in `.claude/instructions.md`.
- **`packages/ui` stays presentational:** no Supabase, router or app state.
  The web app's `index.css` has an `@source` line so Tailwind scans it; keep it
  if the package moves.
- **Patient data goes through database functions.** The app calls
  `list_patients`, `get_patient_counts` and `update_patient_status` (one
  module, `features/patients/api/patients-api.ts`), through TanStack Query.
  They check the caller's practice; the tables aren't readable directly.
- **Content Security Policy:** production builds get a CSP `<meta>` tag from
  a plugin in `apps/web/vite.config.ts`, allowing only the app itself and the
  Supabase origin over HTTPS (no realtime WebSocket). A new external origin (API, font, image host) must be
  added there, or the browser and Electron will block it.
- **Configuration** comes from `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_PUBLISHABLE_KEY` in `apps/web/.env.local` (copy
  `.env.example`). They are bundled into the client, so only a publishable
  key (`sb_publishable_…`) belongs there. The build fails on a missing value,
  a legacy anon key or a secret key (`src/lib/check-supabase-config.ts`).

## Pinned versions

- Node 24 (`.nvmrc`), matching the Node inside Electron.
- TypeScript stays below 6.1, because typescript-eslint doesn't support
  TypeScript 7 yet.
- Electron is pinned to an exact version, which electron-builder requires.
- The packaged desktop app is named `cdm-optimiser` (`extraMetadata` in
  `electron-builder.yml`), not the workspace name. Changing it moves users'
  data folder and signs them out.

@.claude/instructions.md
