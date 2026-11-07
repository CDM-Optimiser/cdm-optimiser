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

## Technology Stack

- **React**, **TypeScript**, **Vite** and **Tailwind CSS** for the dashboard
- **Supabase** for the database, authentication and realtime updates
- **Electron** for the on-premises desktop app
- **Netlify** for the web app

&nbsp;

## Development

### Repository structure

The repository is a Yarn workspaces monorepo:

| Path           | What it is                                                               |
| -------------- | ------------------------------------------------------------------------ |
| `apps/web`     | The React app. Deployed to Netlify as the website.                       |
| `apps/desktop` | The Electron app. Packages the web app's build into a Windows installer. |
| `scripts/`     | Repository scripts (formatting and linting of changed files).            |

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
Supabase project URL and anon key.

### Common commands

| Command             | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `yarn dev:web`      | Runs the web app at http://localhost:5173                      |
| `yarn dev:desktop`  | Runs the desktop app against the dev server                    |
| `yarn test`         | Runs the component tests (Vitest, in Chromium)                 |
| `yarn build:web`    | Builds the web app into `apps/web/dist`                        |
| `yarn test:e2e`     | Runs the end-to-end smoke test against the build               |
| `yarn typecheck`    | Type-checks every workspace                                    |
| `yarn lint`         | Lints the repository (`yarn linc` lints changed files only)    |
| `yarn format`       | Formats the repository (`yarn prettier` formats changed files) |
| `yarn dist:desktop` | Builds the Windows installer into `apps/desktop/release`       |

The tests run in Chromium. On Linux or WSL, install its system libraries once
with `yarn workspace @cdm-optimiser/web playwright install-deps chromium`.

### Deployment

- **Web:** Netlify builds and deploys every push to `main` using
  `netlify.toml`. The Supabase variables are configured in the Netlify UI.
- **Desktop:** push a version tag to build the Windows installer:

  ```sh
  yarn workspace @cdm-optimiser/desktop version 1.2.3
  git commit -am "chore: release desktop v1.2.3"
  git tag v1.2.3
  git push origin main v1.2.3
  ```

  The `Release desktop app` workflow attaches the installer to a draft GitHub
  Release, ready to review and publish.

&nbsp;

## License

This software is proprietary. All rights reserved.  
Contact us for licensing and deployment options.

Thank you for your interest in **CDM Optimiser** — supporting better outcomes for clinics and patients across Ireland.
