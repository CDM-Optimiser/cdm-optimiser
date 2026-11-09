# Working on CDM Optimiser

Detailed working rules for this repository. `CLAUDE.md` at the repo root has
the overview, the repository map and the commands.

## Before you commit

1. Run the `fix` skill: `yarn prettier` formats the changed files, then
   `yarn linc` lints them. Fix everything `linc` reports, warnings
   included; CI runs `yarn lint` on the whole repo and fails on any error or
   warning.
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
    - `auth/`: auth context, provider, `useAuth`, the login form,
      `AccountMenuComponent` (the signed-in email as a button opening
      Account and Logout, in the header bar and the drawer), the logout
      button and `useLogout`, and the Account page's parts: the
      change-password form, the weak-password notice and
      `getPasswordErrorMessage`. The session comes only from Supabase's
      `onAuthStateChange`; `login`, `logout` and `changePassword` just call
      Supabase.
      - **Passwords:** Supabase enforces the rules (runbook A1: at least
        16 characters, `MIN_PASSWORD_LENGTH` in `password-rules.ts` must
        match) and checks the current password (runbook P1). The app
        states the rule, checks the confirmation, and turns Supabase's
        error codes into plain words. When Supabase flags a password as
        weak at sign-in, a notice above every page links to Account.
      - **Signing in has steps** (`getSignInStep`, from the session): the
        password, then a code from an authenticator app, or setting one up
        if the user has none. Only `signed-in` may see patients:
        `ProtectedLayout` sends every other step to the login page, which
        shows the step. See `two-step/` below.
      - **The demo account** is marked in `app_metadata.demo`
        (`isDemoAccount`), which users can't edit. It skips the code step,
        its Account page shows notices instead of the password form and
        the authenticator apps, and the database refuses a new password
        for it whatever the app does (runbook P2).
    - `layout/`: the page frame: the header (the logo, `BrandLogoComponent`,
      linking home; `MainNavComponent` with its `NavItemComponent` links;
      below `lg`, a menu button opening a drawer) and the footer. They are this app's frame, not reusable building
      blocks, so they live here rather than in `packages/ui`: the header
      needs the router, sign-in and the desktop theme, which `packages/ui`
      may not use.
    - `two-step/`: two-step sign-in (Supabase MFA with TOTP factors).
      `two-step-api.ts` is the only module that calls `supabase.auth.mfa`.
      The code step of signing in (`VerifyCodeFormComponent`, which tries
      the code on each of the user's apps), the setup (`SetUpAppComponent`:
      name, QR code and key, first code; nothing is created until the user
      asks for the QR code), and the Account page's list of apps
      (`AuthenticatorAppsComponent`: add another, remove one but never the
      last). Never log a QR code, key or code. Runbook M2 makes the
      database refuse patient data without the second step.
    - `theme/`: the desktop theme menu. `useDesktopTheme` talks to
      `window.darkMode`; the menu only renders the dropdown.
    - `patients/`, split into:
      - `model/`: the `Patient` type, `PatientStatus` and `StatusFilter`
        (`patient.ts`), the CDM conditions (`patient-conditions.ts`), the
        table's columns (`patient-columns.ts`) and the list's filters
        (`status-filters.ts`). Columns, conditions, filters and legend
        items are config arrays: add an entry, not markup.
      - `api/`: see "Patient data" below.
      - `list/`: `usePatientsList` (the list page's state and query), the
        table (`patients-table` › `patient-row` › `patient-cell`), search,
        status filter (a card on wide screens, a drawer below `md`, both
        built from `StatusFilterButtonsComponent`) and legend.
      - `pagination/`: the pagination bar, page-size select and
        `getVisiblePages`.
      - `card/`: `PatientCardComponent`, made of the details, the conditions
        summary and the status form (`usePatientStatusForm`). The card
        reports a save through `onUpdated`; the page shows the message.
      - `pending/`: the navigator of the pending patients page.
  - `lib/`: app-wide modules with no React (the Supabase client,
    `getErrorMessage`).
- `apps/web/public`: files served as they are: the logo (`logo.svg`, and
  `logo-dark.svg` with a white wordmark), the favicons, the phone and
  Android icons (`apple-touch-icon.png`, `icon-192/512.png` in
  `site.webmanifest`) and `og-image.png` (1200×630, for link previews).
  `index.html` links them, with the Open Graph tags and `noindex`: the app
  is private, so search engines must not list it (Netlify also sends
  `X-Robots-Tag`). The smoke test checks each file is linked and served.
  The desktop app's icon is `apps/desktop/build/icon.png` (1024×1024);
  electron-builder makes the Windows icon from it.
  - `hooks/`: generic hooks used by several features (`useDebounce`,
    `useCloseOnWideScreen`). Feature hooks live in their feature folder.
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
  - `components/`: alert (with an optional link or other content under the
    text), button (`primary` for the main action and the selected option in
    a group, `secondary` for the rest), card, dropdown (picks one option),
    menu button (a list of actions and links, such as the account menu),
    modal (a native `<dialog>` with a `title` row; `placement="end"` makes
    it a drawer), svg, switch and text field (with an optional `hint`). The
    dropdown and the menu button share their list styles
    (`popup-classes.ts`) and closing behaviour (`useDismissPopup`). Only
    generic parts belong here; an app's page frame stays in the app.
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
- **`toHaveTextContent` takes a string, not a regular expression,** in
  Vitest browser mode, and compares the element's whole text (whitespace
  collapsed). To check part of an element, find the part
  (`getByRole('alert').getByText('…')`) and assert on that.
- **Browser tests run desktop-sized (1280×800) with reduced motion,** so
  drawers appear at once. A small-screen test sets its own size with
  `page.viewport(390, 844)` (from `vitest/browser`) and resets it in
  `afterEach`. Role queries skip hidden elements, so check that a hidden
  control is gone with `getByRole(…).query()` returning `null`, not with
  `not.toBeVisible()`.
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
  `yarn build:web` first. It never needs a real Supabase project:
  - `smoke.spec.ts` boots the build under its Content Security Policy,
    signed out, and checks that Trusted Types refuses injected HTML.
  - `accessibility.spec.ts` signs in and checks every page with axe
    (WCAG 2.2 AA) in light and dark mode. Add a check when you add a page
    or a dialog.
  - `layout.spec.ts` checks that no page scrolls sideways at phone, iPad
    mini, tablet and desktop sizes, and that pressing a button doesn't
    move the layout.
  - Signed-in tests use `fake-supabase.ts`: it answers Supabase's auth,
    two-step and database calls with synthetic patients and refuses every
    other request to another origin, so nothing leaves the machine. Each
    test expects the list of refused requests to be empty. `signIn` enters
    the password and the fake's code (`FAKE_CODE`); `twoStep: 'none'` gives
    a user who must set up an app first.
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
- **The demo account is public.** The README publishes `test@test.com` /
  `test` for testers. Its practice must only ever hold synthetic patients,
  and no real staff may join it: real patients go into their own practice.
  The maintainers check this with the runbook's demo-account check after
  every import. Nobody can change its password (runbook P2). Don't use the
  demo account in tests; the e2e tests use a fake Supabase.
- The Supabase publishable key (`sb_publishable_…`) is public by design; the
  database functions and row-level security are the security boundary. Never
  put a secret key (`sb_secret_…`) or a legacy service-role key in client code
  or in `VITE_*` variables. The build refuses a secret key.
- Don't add analytics, error reporting or other third-party services without
  an explicit decision from the maintainers.
- **The sign-in session lives in `localStorage`** (Supabase's default, the
  maintainers' choice on 2026-11-08), so users stay signed in until they log
  out. A script injected into the page could read it, so the defence is
  keeping scripts out: the Content Security Policy allows only the app's own
  scripts and requires Trusted Types (a smoke test checks the browser
  refuses injected HTML). Never use `innerHTML`, `insertAdjacentHTML` or
  `dangerouslySetInnerHTML`, never load third-party scripts, and don't
  weaken the policy. `sessionStorage` or memory would be no safer against
  such a script, and `httpOnly` cookies would need a server of our own.

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
  - Check every colour in dark mode too, and add a `dark:` variant unless
    the same class works on both. Dark mode follows the operating system,
    or the theme menu in the desktop app.
- **Contrast is WCAG 2.2 AA:** 4.5:1 for text, 3:1 for meaningful icons,
  control boundaries, states and focus, in both modes. The colour system's
  recipes all pass; check any new pair before using it.
- **One style per role, everywhere.** Changing a recipe means changing every
  component with that role (buttons, toggles, pagination, dropdowns,
  dividers, accent lines), not only the one in front of you.
- **Colour is never the only signal:** a patient's status is also written
  and drawn, and the current page is bold as well as darker.
- **Small screens:** no page may scroll sideways at any width. Below `lg`
  (1024px, so tablets in portrait too) the header's links and account menu
  move into a menu drawer; below `md` (768px) the filters move into a drawer and
  the pagination shows "Page X of Y" between its arrows. Make a drawer with
  `ModalComponent placement="end"` and close it with `useCloseOnWideScreen`
  when the wide layout returns. An element with `sr-only` text inside a
  scroll box needs a positioned ancestor in that box (`relative`), or it
  escapes and widens the page.
- **Buttons keep their size when pressed** (the face moves onto its bottom
  edge). Space them with the parent's `gap`, not vertical margins.
- **Focus:** one ring for every control, set in `apps/web/src/index.css`.
  Don't add per-component focus colours (text fields repeat the same ring,
  see the colour system).
- Other established patterns: `rounded-xl` cards with `shadow-md`, accessible
  labels (`sr-only` text, `aria-*`).
- Use the `frontend-design` skill for new surfaces where a fresh visual
  direction is wanted, not to restyle existing screens. It follows the same
  colour system.
- Copy is in English (Ireland/UK spelling: "optimiser", "enrol").

## Git and pull requests

- Branch from `main`. Use Conventional Commits: `feat`, `fix`, `refactor`,
  `test`, `docs`, `build`, `ci`, `chore` (Dependabot uses `build(deps):`).
- **`main` is protected** by a ruleset ("Protect main", Settings → Rules):
  every change goes through a pull request, which can merge only once
  "Lint, typecheck, test and build" and "Package desktop app" pass. Force
  pushes and deleting `main` are blocked, and nobody can bypass it. If a
  required check is renamed (the job's `name` in `ci.yml`), update the
  ruleset in the same PR, or every PR waits for a check that never runs.
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
- **One version** for the whole app: the root `package.json`, copied into
  `apps/web` and `apps/desktop`. The footer shows it (`__APP_VERSION__`,
  defined in `apps/web/vite.config.ts`). CI fails if the copies disagree
  (`yarn check:versions`).
- **Desktop releases come from merging a version bump:**
  1. On a branch, run `yarn bump <x.y.z>` (never edit the versions by hand,
     and don't name a script `version`: Yarn has that command). Commit as
     `chore(release): <x.y.z>`, label `chore`.
  2. Merge it. `release.yml` sees that `v<x.y.z>` doesn't exist yet, builds
     the Windows installer and publishes the GitHub Release with the
     installer, its `.blockmap` and `latest.yml`. Ordinary merges keep the
     version, so they release nothing. A version with a suffix
     (`1.2.0-rc.1`) becomes a pre-release, which installed apps ignore.
  3. If a release fails, fix it and run `Release` again from the Actions tab.
- **Installed apps update themselves** (`apps/desktop/src/updater.ts`, with
  electron-updater): they check GitHub on start and every 4 hours, download
  a newer release in the background, verify its SHA-512, then show "Restart
  now" (`features/updates/`). Otherwise it installs on the next quit. Only
  the packaged Windows app updates.
- **Pull requests that touch the desktop app** also build the Windows
  installer (`installer-check.yml`), so a broken release shows up before it
  merges.
- **The installer asks** who the app is for and where to install it
  (`nsis` in `electron-builder.yml`). "Only for me", the default, needs no
  admin rights and updates silently; "Anyone who uses this computer" needs
  admin rights, and Windows asks for them on every update.
- The installer is not code-signed yet: Windows SmartScreen shows "Unknown
  publisher" on the first install.

## Known pitfalls

- A fresh shell may default to a Node version without Corepack (Node 25+).
  Run `nvm use` first.
- The first `yarn dev:desktop` or `yarn workspace @cdm-optimiser/desktop start`
  downloads the Electron binary (about 100 MB); later runs reuse it.
- New package versions are installable only once they're 24 hours old. If
  `yarn add` reports a version as "quarantined", use the newest version that
  isn't, and let the next update pick up the latest.
