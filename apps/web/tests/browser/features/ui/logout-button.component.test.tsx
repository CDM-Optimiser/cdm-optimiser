import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import type {User} from '@supabase/supabase-js';
import {LogoutButton} from '../../../../src/features/ui/logout-button.component.tsx';

const mocks = vi.hoisted(() => {
  return {
    useAuth: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock('./../../../src/utils/hooks/useAuth.tsx ', () => {
  return {
    useAuth: mocks.useAuth,
  };
});

vi.mock('react-router', async () => {
  return {
    useNavigate: mocks.useNavigate,
  };
});

describe('Logout button component tests', () => {
  const mockLogout = vi.fn();
  const mockNavigate = vi.fn();

  const createAuthMock = (user: User | null) => ({
    session: null,
    user,
    loading: false,
    login: vi.fn(),
    logout: mockLogout,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useNavigate.mockReturnValue(mockNavigate);

    mockLogout.mockClear();
  });

  test('renders nothing when user is null', async () => {
    mocks.useAuth.mockReturnValue(createAuthMock(null));

    const screen = await render(<LogoutButton />);

    expect(screen.container.firstChild).toBeNull();
  });

  test('renders the Logout button when a user is present', async () => {
    const mockUser = {id: 'user-123'} as User;

    mocks.useAuth.mockReturnValue(createAuthMock(mockUser));

    const screen = await render(<LogoutButton />);
    const button = screen.getByRole('button', {name: 'Logout'});

    expect(button).toBeInTheDocument();
  });

  test('calls logout and navigates to /login when clicked', async () => {
    const mockUser = {id: 'user-123'} as User;

    mocks.useAuth.mockReturnValue(createAuthMock(mockUser));

    const screen = await render(<LogoutButton />);

    await screen.getByRole('button', {name: 'Logout'}).click();

    expect(mockLogout).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('matches snapshot', async () => {
    const mockUser = {id: 'user-123'} as User;

    mocks.useAuth.mockReturnValue(createAuthMock(mockUser));

    const screen = await render(<LogoutButton />);

    expect(screen.container.innerHTML).toMatchSnapshot();
  });
});
