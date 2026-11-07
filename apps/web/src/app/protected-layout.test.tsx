import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {MemoryRouter, Route, Routes, useLocation} from 'react-router';
import type {Session} from '@supabase/supabase-js';
import {ProtectedLayout} from './protected-layout.tsx';

const mocks = vi.hoisted(() => ({useAuth: vi.fn()}));

vi.mock('../features/auth/use-auth.ts', () => ({useAuth: mocks.useAuth}));

const session = {user: {id: 'test-user'}} as Session;

function LoginStub() {
  const location = useLocation();

  return <p>Login page, from {String(location.state?.from)}</p>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="login" element={<LoginStub />} />
        <Route element={<ProtectedLayout />}>
          <Route path="pending-patients" element={<p>Pending page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

const auth = (overrides: object) => ({
  session: null,
  user: null,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  ...overrides,
});

describe('ProtectedLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders nothing while the stored session is being read', async () => {
    mocks.useAuth.mockReturnValue(auth({loading: true}));

    const screen = await renderAt('/pending-patients');

    expect(screen.container).toBeEmptyDOMElement();
  });

  test('sends a signed-out user to the login page, remembering the page', async () => {
    mocks.useAuth.mockReturnValue(auth({}));

    const screen = await renderAt('/pending-patients');

    await expect
      .element(screen.getByText('Login page, from /pending-patients'))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText('Pending page'))
      .not.toBeInTheDocument();
  });

  test('shows the page inside the header, main area and footer when signed in', async () => {
    mocks.useAuth.mockReturnValue(auth({session, user: session.user}));

    const screen = await renderAt('/pending-patients');

    await expect.element(screen.getByRole('banner')).toBeInTheDocument();
    await expect
      .element(screen.getByRole('main').getByText('Pending page'))
      .toBeInTheDocument();
    await expect.element(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
