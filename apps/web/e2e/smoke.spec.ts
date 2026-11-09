import {readFileSync} from 'node:fs';
import {expect, test} from '@playwright/test';

/** The version the footer must show: the root package.json. */
const APP_VERSION: string = JSON.parse(
  readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')
).version;

// Runs against the production build with no real Supabase project, so it
// covers what component tests can't: the bundle loads under the Content
// Security Policy and the routes resolve.

test('boots the production build and redirects to the login page', async ({
  page,
}) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole('heading', {name: 'Login to CDM Optimiser'})
  ).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toContainText(
    `Version ${APP_VERSION}`
  );
  expect(errors, 'no script or CSP errors').toEqual([]);
});

test('the browser refuses HTML injected into the page (Trusted Types)', async ({
  page,
}) => {
  await page.goto('/login');

  // A string as HTML, as an injected script would add it. Under the
  // Content Security Policy's Trusted Types rule, the browser throws.
  const result = await page.evaluate(
    "(() => { try { document.body.insertAdjacentHTML('beforeend', '<img src=x>'); return 'allowed'; } catch (error) { return error.name; } })()"
  );

  expect(result).toBe('TypeError');
});

test('every icon and link-preview image is linked and served', async ({
  page,
  request,
}) => {
  await page.goto('/login');

  const head = page.locator('head');
  const linked = await head
    .locator(
      'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]'
    )
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));

  expect(linked).toEqual([
    '/favicon.ico',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/site.webmanifest',
  ]);

  // Previews name the live site; check the same file in this build.
  const preview = await head
    .locator('meta[property="og:image"]')
    .getAttribute('content');

  expect(preview).toBe('https://cdm-optimiser.netlify.app/og-image.png');
  // A private app: search engines must not list it.
  await expect(head.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow'
  );

  const manifest = await (await request.get('/site.webmanifest')).json();
  const files = [
    ...linked,
    new URL(preview!).pathname,
    ...manifest.icons.map((icon: {src: string}) => icon.src),
    '/logo.svg',
    '/logo-dark.svg',
  ];

  for (const file of files) {
    const response = await request.get(file!);

    expect(response.status(), file!).toBe(200);
    expect(response.headers()['content-type'], file!).not.toContain(
      'text/html'
    );
  }
});

test('sends a signed-out user on any page to the login page', async ({
  page,
}) => {
  await page.goto('/pending-patients');

  await expect(page).toHaveURL(/\/login$/);
});
