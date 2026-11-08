import {beforeEach, describe, expect, test, vi} from 'vitest';
import {renderWithProviders} from '../test/render-with-providers.tsx';
import {AccountPageComponent} from './account-page-component.tsx';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  logout: vi.fn(),
  listAuthenticatorApps: vi.fn(),
}));

vi.mock('../features/auth/use-auth.ts', () => ({useAuth: mocks.useAuth}));
vi.mock('../features/two-step/two-step-api.ts', () => ({
  listAuthenticatorApps: mocks.listAuthenticatorApps,
}));

function renderFor(appMetadata: object) {
  mocks.useAuth.mockReturnValue({
    user: {email: 'test.user@example.com', app_metadata: appMetadata},
    changePassword: vi.fn(),
    logout: mocks.logout,
  });

  mocks.listAuthenticatorApps.mockResolvedValue([]);

  return renderWithProviders(<AccountPageComponent />).then(
    ({screen}) => screen
  );
}

describe('AccountPageComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('has its own heading, and says who is signed in', async () => {
    const screen = await renderFor({provider: 'email'});

    await expect
      .element(screen.getByRole('heading', {level: 1, name: 'Account'}))
      .toBeVisible();
    await expect
      .element(
        screen
          .getByRole('region', {name: 'Signed in'})
          .getByText('test.user@example.com')
      )
      .toBeVisible();
  });

  test('has a Logout button', async () => {
    mocks.logout.mockResolvedValue(undefined);
    const screen = await renderFor({provider: 'email'});

    await screen
      .getByRole('region', {name: 'Signed in'})
      .getByRole('button', {name: 'Logout'})
      .click();

    expect(mocks.logout).toHaveBeenCalledOnce();
  });

  test('has the two-step sign-in section', async () => {
    const screen = await renderFor({provider: 'email'});

    await expect
      .element(
        screen
          .getByRole('region', {name: 'Two-step sign-in'})
          .getByRole('button', {name: 'Add another app'})
      )
      .toBeVisible();
  });

  test('has the change-password form', async () => {
    const screen = await renderFor({provider: 'email'});

    await expect
      .element(
        screen
          .getByRole('region', {name: 'Change password'})
          .getByLabelText('Current password')
      )
      .toBeVisible();
  });

  test('the demo account gets a notice instead of the form', async () => {
    const screen = await renderFor({provider: 'email', demo: true});

    await expect
      .element(screen.getByRole('status').getByText('This is the demo account'))
      .toBeVisible();
    expect(screen.getByLabelText('Current password').query()).toBeNull();
    expect(
      screen.getByRole('button', {name: 'Change password'}).query()
    ).toBeNull();
  });
});
