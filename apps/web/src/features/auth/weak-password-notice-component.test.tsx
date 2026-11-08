import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {MemoryRouter} from 'react-router';
import type {WeakPassword} from '@supabase/supabase-js';
import {WeakPasswordNoticeComponent} from './weak-password-notice-component.tsx';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  dismissWeakPassword: vi.fn(),
}));

vi.mock('./use-auth.ts', () => ({useAuth: mocks.useAuth}));

const tooShort: WeakPassword = {
  reasons: ['length'],
  message: 'Password should be at least 16 characters.',
};

function renderAt(path: string, overrides: object = {}) {
  mocks.useAuth.mockReturnValue({
    user: {app_metadata: {provider: 'email'}},
    weakPassword: tooShort,
    dismissWeakPassword: mocks.dismissWeakPassword,
    ...overrides,
  });

  return render(
    <MemoryRouter initialEntries={[path]}>
      <WeakPasswordNoticeComponent />
    </MemoryRouter>
  );
}

describe('WeakPasswordNoticeComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('says why the password is weak and links to the Account page', async () => {
    const screen = await renderAt('/');
    const notice = screen.getByRole('alert');

    await expect
      .element(notice.getByText('Your password needs changing'))
      .toBeVisible();
    await expect
      .element(notice.getByText(/It’s shorter than 16 characters\./))
      .toBeVisible();
    await expect
      .element(notice.getByRole('link', {name: 'Change your password'}))
      .toHaveAttribute('href', '/account');
  });

  test('can be dismissed', async () => {
    const screen = await renderAt('/');

    await screen.getByRole('button', {name: 'Close alert'}).click();

    expect(mocks.dismissWeakPassword).toHaveBeenCalledOnce();
  });

  test.each([
    ['the password is fine', '/', {weakPassword: null}],
    ['on the Account page, which has the form', '/account', {}],
    [
      'for the demo account, whose password can’t change',
      '/',
      {user: {app_metadata: {demo: true}}},
    ],
  ])('shows nothing when %s', async (_label, path, overrides) => {
    const screen = await renderAt(path, overrides);

    expect(screen.getByRole('alert').query()).toBeNull();
  });
});
