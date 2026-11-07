import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {LogoutButton} from './logout-button.tsx';

const mocks = vi.hoisted(() => ({useAuth: vi.fn(), logout: vi.fn()}));

vi.mock('./use-auth.ts', () => ({useAuth: mocks.useAuth}));

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({logout: mocks.logout});
  });

  test('signs the user out when clicked', async () => {
    mocks.logout.mockResolvedValue(undefined);

    const screen = await render(<LogoutButton />);

    await screen.getByRole('button', {name: 'Logout'}).click();

    expect(mocks.logout).toHaveBeenCalledTimes(1);
  });

  test('keeps working when signing out fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mocks.logout.mockRejectedValue(new Error('Network error'));

    const screen = await render(<LogoutButton />);

    await screen.getByRole('button', {name: 'Logout'}).click();

    await vi.waitFor(() =>
      expect(warn).toHaveBeenCalledWith('Logout failed:', 'Network error')
    );
    await expect
      .element(screen.getByRole('button', {name: 'Logout'}))
      .toBeEnabled();
  });
});
