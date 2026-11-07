import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {MemoryRouter, Route, Routes} from 'react-router';
import type {Session} from '@supabase/supabase-js';
import {LoginPageComponent} from './login-page-component.tsx';

const mocks = vi.hoisted(() => ({useAuth: vi.fn(), login: vi.fn()}));

vi.mock('../features/auth/use-auth.ts', () => ({useAuth: mocks.useAuth}));

const auth = (overrides: object) => ({
  session: null,
  user: null,
  loading: false,
  login: mocks.login,
  logout: vi.fn(),
  ...overrides,
});

function renderLogin(state?: unknown) {
  return render(
    <MemoryRouter initialEntries={[{pathname: '/login', state}]}>
      <Routes>
        <Route path="login" element={<LoginPageComponent />} />
        <Route path="/" element={<p>Patients list</p>} />
        <Route path="pending-patients" element={<p>Pending page</p>} />
      </Routes>
    </MemoryRouter>
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
    mocks.useAuth.mockReturnValue(auth({session: {} as Session}));

    const screen = await renderLogin({from: '/pending-patients'});

    await expect.element(screen.getByText('Pending page')).toBeInTheDocument();
  });

  test('sends a signed-in user to the patients list by default', async () => {
    mocks.useAuth.mockReturnValue(auth({session: {} as Session}));

    const screen = await renderLogin();

    await expect.element(screen.getByText('Patients list')).toBeInTheDocument();
  });
});
