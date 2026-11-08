import {beforeEach, describe, expect, test, vi} from 'vitest';
import {renderWithProviders} from '../../test/render-with-providers.tsx';
import {AuthenticatorAppsComponent} from './authenticator-apps-component.tsx';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  listAuthenticatorApps: vi.fn(),
  removeAuthenticatorApp: vi.fn(),
  startAppSetup: vi.fn(),
  verifyAppCode: vi.fn(),
}));

vi.mock('../auth/use-auth.ts', () => ({useAuth: mocks.useAuth}));
vi.mock('./two-step-api.ts', () => ({
  listAuthenticatorApps: mocks.listAuthenticatorApps,
  removeAuthenticatorApp: mocks.removeAuthenticatorApp,
  startAppSetup: mocks.startAppSetup,
  verifyAppCode: mocks.verifyAppCode,
}));

const app = (id: string, name: string) => ({
  id,
  friendly_name: name,
  factor_type: 'totp',
  status: 'verified',
  created_at: '2026-03-05T10:00:00Z',
  updated_at: '2026-03-05T10:00:00Z',
});

async function renderApps(appMetadata: object = {}) {
  mocks.useAuth.mockReturnValue({user: {app_metadata: appMetadata}});
  const {screen} = await renderWithProviders(<AuthenticatorAppsComponent />);

  return screen;
}

describe('AuthenticatorAppsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('lists the apps with when each was added', async () => {
    mocks.listAuthenticatorApps.mockResolvedValue([app('a', 'Work phone')]);
    const screen = await renderApps();

    await expect.element(screen.getByText('Work phone')).toBeVisible();
    await expect.element(screen.getByText('Added 5 Mar 2026')).toBeVisible();
  });

  test('the only app can’t be removed, and the user is told to add a second', async () => {
    mocks.listAuthenticatorApps.mockResolvedValue([app('a', 'Work phone')]);
    const screen = await renderApps();

    await expect.element(screen.getByText('Work phone')).toBeVisible();
    expect(screen.getByRole('button', {name: /^Remove/}).query()).toBeNull();
    await expect.element(screen.getByText(/Add a second app/)).toBeVisible();
  });

  test('with two apps, either can be removed', async () => {
    mocks.listAuthenticatorApps.mockResolvedValue([
      app('a', 'Work phone'),
      app('b', 'Password manager'),
    ]);
    mocks.removeAuthenticatorApp.mockResolvedValue(undefined);
    const screen = await renderApps();

    await screen.getByRole('button', {name: 'Remove Password manager'}).click();

    await expect
      .element(screen.getByRole('status').getByText(/App removed/))
      .toBeVisible();
    expect(mocks.removeAuthenticatorApp).toHaveBeenCalledWith('b');
  });

  test('Add another app opens the setup, and Cancel closes it', async () => {
    mocks.listAuthenticatorApps.mockResolvedValue([app('a', 'Work phone')]);
    const screen = await renderApps();

    await screen.getByRole('button', {name: 'Add another app'}).click();

    await expect
      .element(screen.getByLabelText('Name for this app'))
      .toHaveValue('');

    await screen.getByRole('button', {name: 'Cancel'}).click();

    await expect
      .element(screen.getByRole('button', {name: 'Add another app'}))
      .toBeVisible();
  });

  test('the demo account gets a notice, and nothing is fetched', async () => {
    const screen = await renderApps({demo: true});

    await expect
      .element(screen.getByText('Not used by the demo account'))
      .toBeVisible();
    expect(mocks.listAuthenticatorApps).not.toHaveBeenCalled();
  });
});
