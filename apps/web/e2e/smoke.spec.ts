import {expect, test} from '@playwright/test';

test('boots the production build and redirects to the login page', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveURL(/#\/login$/);
  await expect(
    page.getByRole('heading', {name: 'Login to CDM Optimiser'})
  ).toBeVisible();
});
