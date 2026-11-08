import {expect, test} from '@playwright/test';
import {signIn, useFakeSupabase} from './fake-supabase.ts';

test('pressing a button moves its face, not the layout around it', async ({
  page,
}) => {
  await useFakeSupabase(page);
  await signIn(page);

  const header = page.getByRole('banner');
  const logout = page.getByRole('button', {name: 'Logout'});
  const headerBefore = await header.boundingBox();
  const buttonBefore = await logout.boundingBox();

  await logout.hover();
  await page.mouse.down();

  const headerPressed = await header.boundingBox();
  const buttonPressed = await logout.boundingBox();

  // Leave before letting go, so it isn't a click and nobody is signed out.
  await page.mouse.move(0, 0);
  await page.mouse.up();

  expect(headerPressed?.height).toBe(headerBefore?.height);
  expect(buttonPressed!.y).toBeGreaterThan(buttonBefore!.y);
});

for (const [device, width, height] of [
  ['a phone', 390, 844],
  ['an iPad mini in portrait', 768, 1024],
  ['a tablet in landscape', 1024, 768],
  ['a desktop', 1440, 900],
] as const) {
  test(`no page scrolls sideways on ${device}`, async ({page}) => {
    await page.setViewportSize({width, height});
    await useFakeSupabase(page);

    const scrollsSideways = () =>
      page
        .locator('html')
        .evaluate((html) => html.scrollWidth > html.clientWidth);

    await page.goto('/login');
    expect(await scrollsSideways(), 'login').toBe(false);

    await signIn(page);
    await expect(page.getByRole('table')).toBeVisible();
    expect(await scrollsSideways(), 'patients list').toBe(false);

    await page.goto('/pending-patients');
    await expect(page.getByText('Pending patient: 1 of')).toBeVisible();
    expect(await scrollsSideways(), 'pending patients').toBe(false);

    await page.goto('/no-such-page');
    await expect(
      page.getByRole('heading', {name: 'Page not found'})
    ).toBeVisible();
    expect(await scrollsSideways(), 'page not found').toBe(false);
  });
}
