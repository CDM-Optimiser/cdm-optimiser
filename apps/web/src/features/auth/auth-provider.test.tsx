import {act} from 'react';
import {beforeEach, describe, expect, test, vi} from 'vitest';
import type {AuthChangeEvent, Session} from '@supabase/supabase-js';
import {renderWithProviders} from '../../test/render-with-providers.tsx';
import {AuthProvider} from './auth-provider.tsx';
import {useAuth} from './use-auth.ts';

type Listener = (event: AuthChangeEvent, session: Session | null) => void;

const mocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  updateUser: vi.fn(),
  signOut: vi.fn(),
  listener: undefined as Listener | undefined,
}));

vi.mock('../../lib/supabase.ts', () => ({
  supabase: {
    auth: {
      onAuthStateChange: (listener: Listener) => {
        mocks.listener = listener;
        listener('INITIAL_SESSION', null);

        return {data: {subscription: {unsubscribe: () => {}}}};
      },
      signInWithPassword: mocks.signInWithPassword,
      updateUser: mocks.updateUser,
      signOut: mocks.signOut,
    },
  },
}));

/** Shows the provider's weak-password state, with buttons to drive it. */
function Probe() {
  const {weakPassword, login, changePassword, dismissWeakPassword} = useAuth();

  return (
    <>
      <p>Weak password: {weakPassword?.reasons.join(', ') ?? 'none'}</p>
      <button onClick={() => login('test.user@example.com', 'short')}>
        Sign in
      </button>
      <button onClick={() => changePassword('short', 'a-much-longer-one')}>
        Change password
      </button>
      <button onClick={dismissWeakPassword}>Dismiss</button>
    </>
  );
}

async function renderSignedInWithWeakPassword() {
  mocks.signInWithPassword.mockResolvedValue({
    data: {
      user: {},
      session: {},
      weakPassword: {reasons: ['length'], message: 'Too short'},
    },
    error: null,
  });

  const {screen} = await renderWithProviders(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );

  await screen.getByRole('button', {name: 'Sign in'}).click();
  await expect.element(screen.getByText('Weak password: length')).toBeVisible();

  return screen;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('a sign-in without a warning leaves no weak password', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      data: {user: {}, session: {}},
      error: null,
    });
    const {screen} = await renderWithProviders(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await screen.getByRole('button', {name: 'Sign in'}).click();

    await vi.waitFor(() =>
      expect(mocks.signInWithPassword).toHaveBeenCalledOnce()
    );
    await expect.element(screen.getByText('Weak password: none')).toBeVisible();
  });

  test('changing the password sends the current one, and clears the warning', async () => {
    mocks.updateUser.mockResolvedValue({data: {user: {}}, error: null});
    const screen = await renderSignedInWithWeakPassword();

    await screen.getByRole('button', {name: 'Change password'}).click();

    await expect.element(screen.getByText('Weak password: none')).toBeVisible();
    expect(mocks.updateUser).toHaveBeenCalledExactlyOnceWith({
      password: 'a-much-longer-one',
      current_password: 'short',
    });
  });

  test('dismissing clears the warning', async () => {
    const screen = await renderSignedInWithWeakPassword();

    await screen.getByRole('button', {name: 'Dismiss'}).click();

    await expect.element(screen.getByText('Weak password: none')).toBeVisible();
  });

  test('signing out clears the warning', async () => {
    const screen = await renderSignedInWithWeakPassword();

    act(() => mocks.listener?.('SIGNED_OUT', null));

    await expect.element(screen.getByText('Weak password: none')).toBeVisible();
  });
});
