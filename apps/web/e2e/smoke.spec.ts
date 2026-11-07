import {expect, test} from '@playwright/test';

// Runs against the production build with no real Supabase project, so it
// covers what component tests can't: the bundle loads under the Content
// Security Policy and the hash routes resolve.

test('boots the production build and redirects to the login page', async ({
  page,
}) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');

  await expect(page).toHaveURL(/#\/login$/);
  await expect(
    page.getByRole('heading', {name: 'Login to CDM Optimiser'})
  ).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  expect(errors, 'no script or CSP errors').toEqual([]);
});

test('sends a signed-out user on any page to the login page', async ({
  page,
}) => {
  await page.goto('/#/pending-patients');

  await expect(page).toHaveURL(/#\/login$/);
});
