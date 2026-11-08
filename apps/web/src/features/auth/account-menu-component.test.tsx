import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {MemoryRouter, Route, Routes} from 'react-router';
import {AccountMenuComponent} from './account-menu-component.tsx';

const mocks = vi.hoisted(() => ({useAuth: vi.fn(), logout: vi.fn()}));

vi.mock('./use-auth.ts', () => ({useAuth: mocks.useAuth}));

function renderAt(path: string, onNavigate?: () => void) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AccountMenuComponent onNavigate={onNavigate} />
      <Routes>
        <Route path="/" element={<p>Patients list</p>} />
        <Route path="account" element={<p>Account page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

const TRIGGER = {name: 'Account: test.user@example.com'};

describe('AccountMenuComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({
      user: {email: 'test.user@example.com'},
      logout: mocks.logout,
    });
  });

  test('shows the signed-in email on a button that opens the menu', async () => {
    const screen = await renderAt('/');
    const trigger = screen.getByRole('button', TRIGGER);

    await expect
      .element(trigger.getByText('test.user@example.com'))
      .toBeVisible();
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('Account goes to the Account page', async () => {
    const onNavigate = vi.fn();
    const screen = await renderAt('/', onNavigate);

    await screen.getByRole('button', TRIGGER).click();
    await screen.getByRole('link', {name: 'Account'}).click();

    await expect.element(screen.getByText('Account page')).toBeVisible();
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  test('Account is marked as the current page on the Account page', async () => {
    const screen = await renderAt('/account');

    await screen.getByRole('button', TRIGGER).click();

    await expect
      .element(screen.getByRole('link', {name: 'Account'}))
      .toHaveAttribute('aria-current', 'page');
  });

  test('Logout signs the user out', async () => {
    mocks.logout.mockResolvedValue(undefined);
    const screen = await renderAt('/');

    await screen.getByRole('button', TRIGGER).click();
    await screen.getByRole('button', {name: 'Logout'}).click();

    expect(mocks.logout).toHaveBeenCalledOnce();
  });

  test('shows nothing without a signed-in email', async () => {
    mocks.useAuth.mockReturnValue({user: null, logout: mocks.logout});
    const screen = await renderAt('/');

    expect(screen.getByRole('button').query()).toBeNull();
  });
});
