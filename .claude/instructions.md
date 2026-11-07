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
- Yarn blocks dependency install scripts by default, and no package currently
  needs one (Electron downloads its binary the first time it runs). If a new
  package can't work without its script, allow only that package with
  `dependenciesMeta.<name>.built: true` in the root `package.json`, and say
  why.
- Yarn skips package versions published less than 24 hours ago
  (`npmMinimalAgeGate`). Don't override it.
- Yarn's built-in commands win over scripts with the same name: `yarn pack`
  runs Yarn's tarball command, which is why the desktop packaging script is
  called `pack:dir`. Don't name scripts after Yarn commands.
- Version constraints: TypeScript below 6.1; `@types/node` on 24.x to match the
  runtime; Electron on an exact version.

## Where code goes

- `apps/web/src`: everything the user sees. Code is grouped by feature, not
  by kind of file.
  - `app/`: the app shell: `app.tsx` with the routes, `query-client.ts`, and
    `protected-layout.tsx`, which waits for the session, sends signed-out
    users to the login page and frames every signed-in page (header,
    `<main>`, footer). Pages render inside that `<main>`, so they don't add
    their own.
  - `pages/`: one component per route. Pages compose features; they hold no
    data access of their own.
  - `features/<area>/`: everything for one area of the app, together.
    - `auth/`: auth context, provider, `useAuth`, the login form and the
      logout button. The session comes only from Supabase's
      `onAuthStateChange`; `login` and `logout` just call Supabase.
    - `layout/`: the header.
    - `theme/`: the desktop theme menu.
    - `patients/`: split into `model/` (the `Patient` type, `PatientStatus`,
      `StatusFilter`, column config), `api/` (see "Patient data" below),
      `list/`, `pagination/` and `card/`.
  - `lib/`: app-wide modules with no React (the Supabase client,
    `getErrorMessage`).
  - `hooks/`: generic hooks used by several features (`useDebounce`).
    Feature hooks live in their feature folder.
  - Don't add a `utils/` folder: put each helper next to the feature that
    uses it, or in `lib/` if several features do.
  - One component per file. Don't wrap a single `useState` in a custom
    hook; write a hook when it holds real logic.
  - Types for patient status come from `features/patients/model/patient.ts`.
    Don't redeclare the `'accepted' | 'refused' | 'pending'` union.
  - `test/`: shared test helpers: `render-with-providers.tsx` (a fresh
    QueryClient and a MemoryRouter) and `fixtures/` (synthetic patients).

### Patient data

Server state lives in TanStack Query; UI state (search box, filter, page)
stays in `useState` in the page.

- `features/patients/api/patients-api.ts` is the only module that calls
  Supabase for patients. It calls three database functions,
  `list_patients`, `get_patient_counts` and `update_patient_status`, which
  check the caller's practice. Tables are not readable directly.
- `toPatient` maps the database row (0/1 flags) to `Patient` (booleans and
  one `status`). The rest of the app never sees `accepted`/`refused`.
- Components use the hooks next to it (`usePatientsPage`,
  `usePatientCounts`, `useUpdatePatientStatus`), never `supabase` itself.
- Query keys come from `patient-keys.ts`. After a change, invalidate
  `patientKeys.all`, which refreshes every list and the counts.
- The list is paginated on the server: one page per request. Don't fetch
  every patient to filter in the browser.
- RPCs go as POST, so a search (possibly a patient's name) stays out of
  URLs and logs. Don't switch them to `{get: true}`.
- Nothing is persisted: no query persistence and no `localStorage` for
  patient data. `AuthProvider` clears the cache on sign-out.
- There is no realtime. Data refetches after the user's own changes and when
  the window regains focus (data is stale after 30 s).
- `packages/ui/src`: generic, presentational building blocks. They take
  everything through props and must not import Supabase, the router or
  anything from `apps/`. Apps import each one from its own file through the
  package's `exports`
  (`import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx'`).
  - `components/`: alert, button (`primary`, `segment`), card, dropdown,
    footer, modal (a native `<dialog>`), svg, switch and text field.
  - `icons/`: one component per icon, decorative (`aria-hidden`) by default.
    Use them instead of pasting `<svg>` markup.
  - Use these instead of copying class strings: a button is
    `ButtonComponent`, a panel is `CardComponent`, a labelled input is
    `TextFieldComponent`, an on/off control is `SwitchComponent`.
- `packages/desktop-bridge/src/index.d.ts`: the IPC contract. Types only,
  never runtime code: the sandboxed preload can't import modules.
- `apps/desktop/src`: Electron only (window setup, IPC handlers, preload). No
  application logic.
- Relative imports in TypeScript use explicit file extensions
  (`'./header-component.tsx'`), as `allowImportingTsExtensions` requires.
  `apps/desktop` is the exception: it is compiled with `tsc` (`NodeNext`), so
  its relative imports name the compiled file (`'./resolve-renderer-file.js'`).

### File names

**Every file name is kebab-case**: lowercase words joined by dashes, never
camelCase or PascalCase. A file is named after what it exports, converted to
kebab-case, and keeps its suffixes after the first dot:

| Export                          | File                                                  |
| ------------------------------- | ----------------------------------------------------- |
| `StatusLegendComponent`         | `status-legend-component.tsx`                         |
| its test and snapshot           | `status-legend-component.test.tsx(.snap)`             |
| `AuthProvider`, `LogoutButton`  | `auth-provider.tsx`, `logout-button.tsx`              |
| `useAutoDismiss`                | `use-auto-dismiss.ts`                                 |
| `getErrorMessage`               | `get-error-message.ts`                                |
| `AuthContext`                   | `auth-context.ts`                                     |
| `CheckIcon`                     | `check-icon.tsx`                                      |
| several related types or values | a kebab-case noun: `patient.ts`, `patient-columns.ts` |

- Hooks and modules without JSX are `.ts`; anything with JSX is `.tsx`.
- Folders are kebab-case too (`features/patients`, `__snapshots__` aside).
- The only exceptions are names that tools require, all lowercase already:
  `main.tsx`, `vite-env.d.ts`, `*.config.ts`, `index.html`, `*.spec.ts`
  (Playwright), workflow files and Supabase migrations.

### No barrel files

Never create a barrel: an `index.ts` (or any file) whose job is to re-export
other modules. Import every value from the file that defines it.

- Inside an app or package, import the file directly
  (`'../features/auth/use-auth.ts'`).
- A package exposes its folders through `exports` in its `package.json`
  (`"./components/*": "./src/components/*"`), so other workspaces import
  files directly as well.
- `packages/desktop-bridge/src/index.d.ts` is not a barrel: it is the
  package's only module, and it defines the types itself.

## Testing

- **Tests sit next to the code they test:** `header-component.tsx` has
  `header-component.test.tsx` in the same folder, and its snapshots in a
  `__snapshots__/` folder beside them. Every new component gets its test file
  alongside it. Import the code under test with `./`
  (`import {HeaderComponent} from './header-component.tsx'`).
- **The file name picks the environment.** `*.test.tsx` files run in Vitest
  browser mode with Playwright Chromium and `vitest-browser-react`; prefer
  `await expect.element(locator)` for assertions that wait for the DOM.
  Pure-logic tests named `*.unit.test.ts` run in jsdom instead (web app only).
  `apps/desktop` tests (`*.test.ts`) use Node's built-in `node:test` and run
  on the compiled files; `electron-builder.yml` leaves them out of the
  package.
- **Browser tests load the real styles.** A setup file
  (`packages/ui/test/setup.ts`, `apps/web/src/test/`) loads Tailwind and the
  app's CSS, so the Vitest UI shows components as users see them, and
  visibility checks behave as in the app.
- **Test behaviour, not implementation.** Query by role and accessible name
  (`getByRole('button', {name: 'Save'})`), and assert what the user sees or
  what a callback receives, not which hook was called with which arguments.
- **Keyboard tests start from an element:** call `.focus()` on it first.
  Where the first `userEvent.tab()` lands depends on the test runner's
  iframe, which makes tests flaky.
- `vi.mock()` paths are relative to the test file and must resolve to the real
  module. A wrong path silently mocks nothing.
- Test files are never bundled: Vite only builds what `index.html` imports,
  following imports file by file.
- **Snapshots:** update them with `yarn workspace <package> test:update`
  (e.g. `@cdm-optimiser/ui`) only when the UI change is intended, and review
  the snapshot diff.
- **End-to-end:** `apps/web/e2e` runs against the production build, so run
  `yarn build:web` first. Keep it a smoke test that needs no real Supabase
  project.
- **Local browsers:** Chromium needs system libraries. On Linux or WSL, install
  them once with
  `yarn workspace @cdm-optimiser/web playwright install-deps chromium`
  (it asks for `sudo`).

## Electron security

- Keep `contextIsolation: true`, `nodeIntegration: false` and `sandbox: true`.
- Expose renderer APIs only through `contextBridge` in the preload, one small
  function per IPC channel. Never expose `ipcRenderer` itself.
- Register handlers with the typed `handle()` helper in `main.ts`. Payloads
  arrive as `unknown`: validate them before use (see `isThemeValue`).
- The window only shows the app: `will-navigate` blocks other URLs and
  `setWindowOpenHandler` sends `https:` links to the system browser. Don't
  load remote content into the window.
- The renderer is served on `app://cdm-optimiser/` by `protocol.handle` in
  `main.ts`, not loaded from `file://` (Electron's security checklist, item
  18). The handler only serves files inside `renderer/`
  (`resolve-renderer-file.ts`, with tests). Don't use `loadFile`.
- DevTools open only in development or with the `--devtools` flag. Don't make
  them open in packaged builds.
- Packaged builds have Electron fuses set in `electron-builder.yml` (no
  run-as-node, no `NODE_OPTIONS` or `--inspect`, asar-only with integrity
  checks, no extra `file://` privileges). Don't turn them off.

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

## UI work and colours

- Colours come from the CDM Optimiser colour system. The full reference, with
  the class recipes for each element, is the "CDM Optimiser colour system"
  section of `.claude/skills/frontend-design/SKILL.md`. In short:
  - Tailwind's default palette with no custom theme. Use Tailwind colour
    classes only: no hex codes, arbitrary values or inline colours.
  - `sky` is the primary colour: actions, links, focus, selection, hover.
    `gray` and `white` are for the page, surfaces, text and borders.
  - Green (emerald in dark mode) means a patient accepted and red (rose in
    dark mode) means they refused. Never use green or red decoratively.
    Pending patients have no colour.
  - Messages use `AlertComponent` from `@cdm-optimiser/ui`: info is sky,
    success green, warning yellow, error red.
  - Every colour needs a `dark:` variant. Dark mode follows the operating
    system, or the theme menu in the desktop app.
- Some existing colour pairs fail WCAG contrast (white on `sky-500` buttons,
  `sky-500` links, `gray-400` and green icons). They're listed under "Known
  gaps" in the colour system and belong to the bug-fix plan: don't fix them
  one component at a time.
- Other established patterns: `rounded-xl` cards with `shadow-md`, accessible
  labels (`sr-only` text, `aria-*`) and visible focus states.
- Use the `frontend-design` skill for new surfaces where a fresh visual
  direction is wanted, not to restyle existing screens. It follows the same
  colour system.
- Copy is in English (Ireland/UK spelling: "optimiser", "enrol").

## Git and pull requests

- Branch from `main`. Use Conventional Commits: `feat`, `fix`, `refactor`,
  `test`, `docs`, `build`, `ci`, `chore` (Dependabot uses `build(deps):`).
- Fill in `.github/PULL_REQUEST_TEMPLATE.md`.
- Keep formatting-only changes in their own commit.
- Never commit database material: schema or policy exports, SQL or Edge
  Function code. Maintainers keep it outside this repository; changes to the
  database are applied in the Supabase dashboard.
- Keep local Git helper files (such as a blame-ignore list) out of the
  repository: list them in `.git/info/exclude`, not `.gitignore`.

### Labels

**Every pull request gets labels, with no exceptions.** Add them when you
create it (`gh pr create --label bug --label ci/cd …`), or straight afterwards
with `gh pr edit <number> --add-label <name>`. Check that they're there before
you report the PR.

Add one label for each kind of change in the PR (its Conventional Commit
types):

| Change in the PR                                      | Label            |
| ----------------------------------------------------- | ---------------- |
| `feat`: new feature or behaviour                      | `enhancement`    |
| `fix`: bug fix                                        | `bug`            |
| `refactor` or `perf`: no change in behaviour          | `refactor`       |
| `test`: tests or test tooling                         | `tests`          |
| `docs`: documentation, README, Claude Code files      | `documentation`  |
| `build`: project structure, tooling, new dependencies | `project`        |
| `build(deps)`: dependency updates                     | `dependencies`   |
| GitHub Actions updates (with `dependencies`)          | `github_actions` |
| `ci`: workflows, Netlify, release pipeline            | `ci/cd`          |
| `chore`: other maintenance                            | `chore`          |

Also add these when they apply, whatever the type:

| The PR…                                                    | Label           |
| ---------------------------------------------------------- | --------------- |
| Hardens security or fixes a vulnerability (CSP, Electron)  | `security`      |
| Improves accessibility (contrast, keyboard, screen reader) | `accessibility` |

- See the current labels with `gh label list`. Don't use `duplicate`,
  `invalid`, `question`, `wontfix`, `good first issue` or `help wanted` on
  pull requests you open; they're for triage.
- If no label fits, create one rather than leaving the PR unlabelled:
  `gh label create <name> --color <hex> --description "<one sentence>"`,
  lowercase and in the style of the existing ones. Add it to the tables
  above in the same PR, and tell the maintainer you created it.
- Dependabot labels its own PRs (`labels` in `.github/dependabot.yml`).

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
- The first `yarn dev:desktop` or `yarn workspace @cdm-optimiser/desktop start`
  downloads the Electron binary (about 100 MB); later runs reuse it.
- New package versions are installable only once they're 24 hours old. If
  `yarn add` reports a version as "quarantined", use the newest version that
  isn't, and let the next update pick up the latest.
