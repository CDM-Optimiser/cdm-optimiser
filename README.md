# CDM Optimiser

**CDM Optimiser** is a healthcare analytics startup dedicated to empowering Irish GP practices to enhance their Chronic Disease Management (CDM) performance, maximise programme revenue, and streamline administrative workflows.

Our solution provides clinics with a **data-driven CDM audit**, identifying patients who are clinically eligible but not yet enrolled in the CDM programme. Through an intuitive, visual dashboard, administrative teams can easily prioritise, contact, and enroll these patients—reducing manual workload and improving care outcomes.

&nbsp;

## What We Do

CDM Optimiser bridges the gap between **clinical eligibility** and **CDM participation** by offering:

- **Automated eligibility detection** for patients qualifying under CDM criteria.
- **Comprehensive analytics** highlighting missed opportunities and enrolment gaps.
- **Streamlined recall workflows** for practice staff.
- **Revenue projections** showing the financial impact of enrolling eligible patients.
- **An easy-to-use dashboard** supporting clear, actionable decision-making.

&nbsp;

## Our Mission

To enable Irish GP practices to:

- Reduce administrative burden
- Increase CDM participation rates
- Improve patient care quality
- Unlock missed programme revenue

We believe that every clinic should have the tools to deliver proactive care—and be fairly compensated for it.

&nbsp;

## About the Organisation

The **CDM Optimiser Organisation** focuses on building high-quality healthcare solutions tailored to the needs of Irish primary care. Our software is developed in close collaboration with clinical and administrative teams to ensure practicality, compliance, and measurable impact.

&nbsp;

## Try the demo

Sign in to the live app at **https://cdm-optimiser.netlify.app** with the
demo account:

| Email           | Password |
| --------------- | -------- |
| `test@test.com` | `test`   |

- Every patient you see is **synthetic** ("Test Patient 0001", GMS
  "TEST0001"). The demo account's practice never holds real patient data.
- You can accept and refuse patients. Other testers share the same data, so
  it may change while you look.
- The desktop app, from the
  [latest release](https://github.com/CDM-Optimiser/cdm-optimiser/releases/latest),
  accepts the same account. Its installer lets you choose the folder, and
  whether it's for you only (no admin rights needed, updates install
  silently) or for everyone on the PC (Windows asks for admin rights at
  install and on each update).
- If the demo sign-in stops working, please
  [open an issue](https://github.com/CDM-Optimiser/cdm-optimiser/issues).

&nbsp;

## Technology Stack

- **React**, **TypeScript**, **Vite** and **Tailwind CSS** for the dashboard
- **Supabase** for the database, authentication and realtime updates
- **Electron** for the on-premises desktop app
- **Netlify** for the web app

&nbsp;

## Development

### Repository structure

The repository is a Yarn workspaces monorepo:

| Path                      | What it is                                                                 |
| ------------------------- | -------------------------------------------------------------------------- |
| `apps/web`                | The React app. Deployed to Netlify as the website.                         |
| `apps/desktop`            | The Electron app. Packages the web app's build into a Windows installer.   |
| `packages/ui`             | Shared presentational components (alerts, modal, dropdown, footer, icons). |
| `packages/desktop-bridge` | Type definitions for the calls between the Electron app and the web app.   |
| `scripts/`                | Repository scripts (formatting and linting of changed files).              |

### Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (or another Node version manager)
- Node.js 24, from `.nvmrc`
- Yarn 4, provided by Corepack (bundled with Node 24)

```sh
nvm use
corepack enable
yarn install
```

Then copy `apps/web/.env.example` to `apps/web/.env.local` and fill in the
Supabase project URL and publishable key (`sb_publishable_…`, from Project
Settings → API Keys).

### Common commands

| Command             | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `yarn dev:web`      | Runs the web app at http://localhost:5173                      |
| `yarn dev:desktop`  | Runs the desktop app against the dev server                    |
| `yarn test`         | Runs the component tests (Vitest, in Chromium)                 |
| `yarn build:web`    | Builds the web app into `apps/web/dist`                        |
| `yarn test:e2e`     | Runs the end-to-end and accessibility tests against the build  |
| `yarn typecheck`    | Type-checks every workspace                                    |
| `yarn lint`         | Lints the repository (`yarn linc` lints changed files only)    |
| `yarn format`       | Formats the repository (`yarn prettier` formats changed files) |
| `yarn dist:desktop` | Builds the Windows installer into `apps/desktop/release`       |

The tests run in Chromium. On Linux or WSL, install its system libraries once
with `yarn workspace @cdm-optimiser/web playwright install-deps chromium`.

### Deployment

- **Web:** Netlify builds and deploys every push to `main` using
  `netlify.toml`. The Supabase variables are configured in the Netlify UI.
- **Version:** one version for the whole app, shown in the footer on the
  website and in the desktop app.
- **Desktop releases:** open a pull request that bumps the version, and merge
  it:

  ```sh
  yarn bump 1.2.0   # sets the version in every package.json
  ```

  The `Release` workflow then builds the Windows installer and publishes
  GitHub Release `v1.2.0`. Installed desktop apps download it in the
  background and offer to restart into it (or install it the next time they
  close).

&nbsp;

## License

This software is proprietary. All rights reserved.  
Contact us for licensing and deployment options.

Thank you for your interest in **CDM Optimiser** — supporting better outcomes for clinics and patients across Ireland.
