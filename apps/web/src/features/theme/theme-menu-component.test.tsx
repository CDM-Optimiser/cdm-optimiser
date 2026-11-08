import {afterEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import type {DarkModeApi, ThemeValue} from '@cdm-optimiser/desktop-bridge';
import {ThemeMenuComponent} from './theme-menu-component.tsx';

/** A stand-in for the bridge the desktop app's preload script exposes. */
function fakeDarkMode(source: unknown = 'system') {
  const darkMode = {
    getThemeSource: vi.fn(async () => source as ThemeValue),
    set: vi.fn(async () => true),
    system: vi.fn(async () => {}),
  } satisfies DarkModeApi;

  window.darkMode = darkMode;

  return darkMode;
}

describe('ThemeMenuComponent', () => {
  afterEach(() => {
    delete window.darkMode;
    vi.restoreAllMocks();
  });

  test('shows nothing in a plain browser', async () => {
    const screen = await render(<ThemeMenuComponent />);

    expect(screen.container).toBeEmptyDOMElement();
  });

  test('starts from the theme the desktop app is using', async () => {
    fakeDarkMode('dark');

    const screen = await render(<ThemeMenuComponent />);

    await expect
      .element(screen.getByRole('button', {name: 'Theme: Dark'}))
      .toBeVisible();
  });

  test('ignores a theme it does not know', async () => {
    fakeDarkMode('sepia');

    const screen = await render(<ThemeMenuComponent />);

    await expect
      .element(screen.getByRole('button', {name: 'Theme: System'}))
      .toBeVisible();
  });

  test('sends the chosen theme to the desktop app', async () => {
    const darkMode = fakeDarkMode('system');

    const screen = await render(<ThemeMenuComponent />);
    await screen.getByRole('button', {name: 'Theme: System'}).click();
    await screen.getByRole('button', {name: 'Light'}).click();

    expect(darkMode.set).toHaveBeenCalledWith('light');
    await expect
      .element(screen.getByRole('button', {name: 'Theme: Light'}))
      .toBeVisible();
  });

  test('falls back to the system theme, and says so, when a change fails', async () => {
    const darkMode = fakeDarkMode('system');
    darkMode.set.mockRejectedValue(new Error('IPC failed'));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const screen = await render(<ThemeMenuComponent />);
    await screen.getByRole('button', {name: 'Theme: System'}).click();
    await screen.getByRole('button', {name: 'Dark'}).click();

    await expect
      .element(screen.getByRole('button', {name: 'Theme: System'}))
      .toBeVisible();
    expect(darkMode.system).toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      'Could not change the theme:',
      'IPC failed'
    );
  });
});
