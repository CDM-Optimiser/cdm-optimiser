import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {MemoryRouter, Route, Routes} from 'react-router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {Session} from '@supabase/supabase-js';
import {LoginPageComponent} from './login-page-component.tsx';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('../features/auth/use-auth.ts', () => ({useAuth: mocks.useAuth}));

const auth = (overrides: object) => ({
  session: null,
  user: null,
  loading: false,
  signInStep: 'password',
  login: mocks.login,
  logout: mocks.logout,
  ...overrides,
});

function renderLogin(state?: unknown) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[{pathname: '/login', state}]}>
        <Routes>
          <Route path="login" element={<LoginPageComponent />} />
          <Route path="/" element={<p>Patients list</p>} />
          <Route path="pending-patients" element={<p>Pending page</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('LoginPageComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('signs in with the email and password typed in the labelled fields', async () => {
    mocks.useAuth.mockReturnValue(auth({}));
    mocks.login.mockResolvedValue(undefined);

    const screen = await renderLogin();

    await screen.getByLabelText('Email').fill('test@example.com');
    await screen.getByLabelText('Password').fill('not-a-real-password');
    await screen.getByRole('button', {name: 'Login'}).click();

    await vi.waitFor(() =>
      expect(mocks.login).toHaveBeenCalledWith(
        'test@example.com',
        'not-a-real-password'
      )
    );
  });

  test('shows the sign-in error once and keeps the email', async () => {
    mocks.useAuth.mockReturnValue(auth({}));
    mocks.login.mockRejectedValue(new Error('Invalid login credentials'));

    const screen = await renderLogin();

    await screen.getByLabelText('Email').fill('test@example.com');
    await screen.getByLabelText('Password').fill('wrong-password');
    await screen.getByRole('button', {name: 'Login'}).click();

    await expect
      .element(screen.getByRole('alert').getByText('Invalid login credentials'))
      .toBeVisible();
    expect(screen.getByRole('alert').elements()).toHaveLength(1);
    await expect
      .element(screen.getByLabelText('Email'))
      .toHaveValue('test@example.com');
  });

  test('sends a signed-in user to the page they were going to', async () => {
    mocks.useAuth.mockReturnValue(
      auth({session: {} as Session, signInStep: 'signed-in'})
    );

    const screen = await renderLogin({from: '/pending-patients'});

    await expect.element(screen.getByText('Pending page')).toBeInTheDocument();
  });

  test('sends a signed-in user to the patients list by default', async () => {
    mocks.useAuth.mockReturnValue(
      auth({session: {} as Session, signInStep: 'signed-in'})
    );

    const screen = await renderLogin();

    await expect.element(screen.getByText('Patients list')).toBeInTheDocument();
  });

  describe('two-step sign-in', () => {
    const withApp = {
      session: {} as Session,
      user: {factors: [{id: 'phone', factor_type: 'totp', status: 'verified'}]},
    };

    test('after the password, asks for the authenticator app’s code', async () => {
      mocks.useAuth.mockReturnValue(
        auth({...withApp, signInStep: 'verify-code'})
      );

      const screen = await renderLogin({from: '/pending-patients'});

      await expect
        .element(
          screen.getByRole('heading', {level: 1, name: 'Two-step sign-in'})
        )
        .toBeVisible();
      await expect
        .element(screen.getByLabelText('Code from your authenticator app'))
        .toBeVisible();
      await expect
        .element(screen.getByText(/stay signed in on this device/))
        .toBeVisible();
      expect(screen.getByLabelText('Password').query()).toBeNull();
      expect(screen.getByText('Pending page').query()).toBeNull();
    });

    test('a user without an app is asked to set one up first', async () => {
      mocks.useAuth.mockReturnValue(
        auth({session: {} as Session, user: {}, signInStep: 'set-up-app'})
      );

      const screen = await renderLogin();

      await expect
        .element(
          screen.getByRole('heading', {
            level: 1,
            name: 'Set up two-step sign-in',
          })
        )
        .toBeVisible();
      await expect
        .element(screen.getByRole('button', {name: 'Show the QR code'}))
        .toBeVisible();
    });

    test('“Use a different account” signs out, back to the password', async () => {
      mocks.logout.mockResolvedValue(undefined);
      mocks.useAuth.mockReturnValue(
        auth({...withApp, signInStep: 'verify-code'})
      );

      const screen = await renderLogin();

      await screen
        .getByRole('button', {name: 'Use a different account'})
        .click();

      expect(mocks.logout).toHaveBeenCalledOnce();
    });
  });
});
