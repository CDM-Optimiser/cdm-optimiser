# Working on CDM Optimiser

Detailed working rules for this repository. `CLAUDE.md` at the repo root has
the overview, the repository map and the commands.

## Before you commit

1. Run the `fix` skill: `yarn prettier` formats the changed files, then
   `yarn linc` lints them. Fix every `linc` error; CI runs `yarn lint` on the
   whole repo and fails on errors.
2. Run `yarn typecheck` and `yarn test`.
3. If you touched the build, routing or Vite config, also run
   `yarn build:web && yarn test:e2e`.
4. If you touched `apps/desktop`, also run
   `yarn workspace @cdm-optimiser/desktop pack:dir` and check that the app
   starts.

Never skip a failing check, never commit with `--no-verify`, and never relax a
lint rule or delete a test to get a green run. Report what fails instead.

## Package management

- Yarn 4 workspaces with a single `yarn.lock` at the root. Never create
  `package-lock.json` or `pnpm-lock.yaml`.
- Add a dependency to the workspace that uses it:
  `yarn workspace @cdm-optimiser/web add <pkg>` (add `-D` for dev
  dependencies). Repo-wide tools (ESLint, Prettier, TypeScript) live in the
  root: `yarn add -D <pkg>`.
- Use `yarn dlx <pkg>` for one-off tools.
- Yarn blocks dependency install scripts by default. Only `electron` is allowed
  to run one (`dependenciesMeta` in the root `package.json`). Allow another
  package only if it can't work without its script, and say why.
- Yarn skips package versions published less than 24 hours ago
  (`npmMinimalAgeGate`). Don't override it.
- Yarn's built-in commands win over scripts with the same name: `yarn pack`
  runs Yarn's tarball command, which is why the desktop packaging script is
  called `pack:dir`. Don't name scripts after Yarn commands.
- Version constraints: TypeScript below 6.1; `@types/node` on 24.x to match the
  runtime; Electron on an exact version.

## Where code goes

- `apps/web/src`: everything the user sees.
  - `pages/`: one component per route.
  - `features/<area>/`: components grouped by feature; `features/ui/` holds
    the generic building blocks (alert, modal, dropdown, svg).
  - `api/`: Supabase data hooks and providers.
  - `utils/`: hooks, helper functions and types.
  - Components are named `<name>.component.tsx`; hooks `use<Name>.tsx`.
- `apps/desktop/src`: Electron only (window setup, IPC handlers, preload). No
  application logic.
- Imports inside `apps/web` use explicit file extensions
  (`'./foo.component.tsx'`), as `allowImportingTsExtensions` requires.

## Testing

- **Component tests** live in `apps/web/tests/browser/` and run in Vitest
  browser mode with Playwright Chromium and `vitest-browser-react`. Prefer
  `await expect.element(locator)` for assertions that wait for the DOM.
- **Pure logic tests** go in `apps/web/tests/unit/`, which runs in jsdom.
- `vi.mock()` paths are relative to the test file and must resolve to the real
  module. A wrong path silently mocks nothing.
- **Snapshots:** update them with
  `yarn workspace @cdm-optimiser/web test:update` only when the UI change is
  intended, and review the snapshot diff.
- **End-to-end:** `apps/web/e2e` runs against the production build, so run
  `yarn build:web` first. Keep it a smoke test that needs no real Supabase
  project.
- **Local browsers:** Chromium needs system libraries. On Linux or WSL, install
  them once with
  `yarn workspace @cdm-optimiser/web playwright install-deps chromium`
  (it asks for `sudo`).

## Electron security

- Keep `contextIsolation: true` and `nodeIntegration: false`. Don't disable the
  sandbox.
- Expose renderer APIs only through `contextBridge` in the preload, one small
  function per IPC channel. Never expose `ipcRenderer` itself.
- Treat every IPC payload as untrusted: validate it in the `main.js` handler.
- Don't load remote content into the window; it only loads the bundled
  renderer or, in development, the Vite dev server.
- DevTools open only in development or with the `--devtools` flag. Don't make
  them open in packaged builds.

## Patient data and privacy

The app processes health data of real patients (GDPR special-category data).

- Never log, print or commit patient records, including in debugging output,
  test fixtures, snapshots, screenshots or issue/PR text.
- Use only synthetic, obviously fake data in tests and examples.
- The Supabase anon key is public by design; row-level security in Supabase
  is the security boundary. Never put a service-role key in client code or in
  `VITE_*` variables.
- Don't add analytics, error reporting or other third-party services without
  an explicit decision from the maintainers.

## UI work

- Inside existing screens, follow the established patterns: Tailwind utility
  classes, the sky palette, `rounded-xl` cards with `shadow-md`, a `dark:`
  variant for every colour, and accessible labels (`sr-only` text, `aria-*`)
  and visible focus states.
- Use the `frontend-design` skill only for new surfaces where a fresh visual
  direction is wanted, not to restyle existing screens.
- Copy is in English (Ireland/UK spelling: "optimiser", "enrol").

## Git and pull requests

- Branch from `main`. Use Conventional Commits: `feat`, `fix`, `refactor`,
  `test`, `docs`, `build`, `ci`, `chore` (Dependabot uses `build(deps):`).
- Fill in `.github/PULL_REQUEST_TEMPLATE.md`.
- Keep formatting-only changes in their own commit and add its hash to
  `.git-blame-ignore-revs`.

## Deploys and releases

- **Web:** Netlify builds every push to `main` (and PR previews) from
  `netlify.toml`. The Netlify UI's "Base directory" must stay empty; the
  Supabase variables are set in the Netlify UI.
- **Desktop:** releases are tag-based.
  1. `yarn workspace @cdm-optimiser/desktop version <x.y.z>`
  2. Commit, then `git tag v<x.y.z>` and push the tag.
  3. `release-desktop.yml` builds the Windows installer and attaches it to a
     draft GitHub Release for a maintainer to publish.

## Known pitfalls

- A fresh shell may default to a Node version without Corepack (Node 25+).
  Run `nvm use` first.
- Web-only installs (Netlify, CI checks) set `ELECTRON_SKIP_BINARY_DOWNLOAD=1`
  to avoid downloading Electron.
- Known failing tests, owned by the bug-fix plan: the footer test (hardcodes
  the year 2025), and the header and logout-button tests (their `vi.mock`
  paths point at a non-existent file). Remove this note once they're fixed.
