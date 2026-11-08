import AxeBuilder from '@axe-core/playwright';
import {expect, test, type Page} from '@playwright/test';
import {signIn, useFakeSupabase} from './fake-supabase.ts';

// Checks every page against WCAG 2.2 AA with axe (contrast, names, roles,
// structure), in light and dark mode, signed in against a fake Supabase.

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Fails with one line per problem: the rule and the elements it found. */
async function expectNoViolations(page: Page, include?: string) {
  const builder = new AxeBuilder({page}).withTags(WCAG_AA);

  if (include) builder.include(include);

  const {violations} = await builder.analyze();

  expect(
    violations.map(
      (violation) =>
        `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`
    )
  ).toEqual([]);
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`${colorScheme} mode`, () => {
    test.use({colorScheme});

    test('the login page, and a failed sign-in', async ({page}) => {
      const refused = await useFakeSupabase(page, {rejectLogin: true});

      await page.goto('/login');
      await expect(page.getByRole('heading', {level: 1})).toBeVisible();
      await expectNoViolations(page);

      await page.getByLabel('Email').fill('test.user@example.com');
      await page.getByLabel('Password').fill('not-a-real-password');
      await page.getByRole('button', {name: 'Login'}).click();
      await expect(page.getByRole('alert')).toBeVisible();
      await expectNoViolations(page);

      expect(refused).toEqual([]);
    });

    test('the patients list, and a patient’s details', async ({page}) => {
      const refused = await useFakeSupabase(page);

      await signIn(page);
      await expect(page.getByRole('table')).toBeVisible();
      await expectNoViolations(page);

      await page.getByRole('button', {name: 'Test Patient 0002'}).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      // The page behind the backdrop isn't what the user is reading.
      await expectNoViolations(page, 'dialog');

      expect(refused).toEqual([]);
    });

    test('the menu drawer on a phone', async ({page}) => {
      const refused = await useFakeSupabase(page);

      await page.setViewportSize({width: 390, height: 844});
      await signIn(page);
      await page.getByRole('button', {name: 'Open menu'}).click();
      await expect(page.getByRole('dialog', {name: 'Menu'})).toBeVisible();
      await expectNoViolations(page, 'dialog');

      expect(refused).toEqual([]);
    });

    test('the filters drawer on a phone', async ({page}) => {
      const refused = await useFakeSupabase(page);

      await page.setViewportSize({width: 390, height: 844});
      await signIn(page);
      await page.getByRole('button', {name: 'Filters: All'}).click();
      await expect(page.getByRole('dialog', {name: 'Filters'})).toBeVisible();
      await expectNoViolations(page, 'dialog');

      expect(refused).toEqual([]);
    });

    test('the pending patients page', async ({page}) => {
      const refused = await useFakeSupabase(page);

      await signIn(page);
      await page.getByRole('link', {name: 'Pending Patients'}).click();
      await expect(page.getByText('Pending patient: 1 of')).toBeVisible();
      await expectNoViolations(page);

      expect(refused).toEqual([]);
    });

    test('the page-not-found page', async ({page}) => {
      const refused = await useFakeSupabase(page);

      await signIn(page);
      await page.goto('/no-such-page');
      await expect(
        page.getByRole('heading', {name: 'Page not found'})
      ).toBeVisible();
      await expectNoViolations(page);

      expect(refused).toEqual([]);
    });
  });
}
