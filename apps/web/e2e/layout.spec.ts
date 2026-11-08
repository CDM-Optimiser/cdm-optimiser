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
