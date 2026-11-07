import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {MemoryRouter} from 'react-router';
import type {User} from '@supabase/supabase-js';
import {HeaderComponent} from '../../../../src/features/ui/header.component.tsx';

const mocks = vi.hoisted(() => {
  return {
    useAuth: vi.fn(),
    LogoutButton: () => (
      <div data-testid="logout-button-mock">Logout Placeholder</div>
    ),
  };
});

vi.mock('./../../../src/utils/hooks/useAuth.tsx ', () => {
  return {
    useAuth: mocks.useAuth,
  };
});

vi.mock('../../../../src/features/ui/logout-button.component.tsx', () => ({
  LogoutButton: mocks.LogoutButton,
}));

describe('Header component tests', () => {
  const mockUser = {id: '1', email: 'test@test.com'} as User;
  const title = 'CDM Optimiser';

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useAuth.mockReturnValue({user: mockUser});
  });

  test('does not render when the user is NOT authenticated', async () => {
    mocks.useAuth.mockReturnValue({user: null});

    const screen = await render(
      <MemoryRouter>
        <HeaderComponent title={title} />
      </MemoryRouter>
    );

    expect(screen.container.firstChild).toBeNull();

    expect(
      screen.getByRole('link', {name: 'Patients List'})
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', {name: 'Pending Patients'})
    ).not.toBeInTheDocument();
  });

  test('renders the title and navigation when the user IS authenticated', async () => {
    mocks.useAuth.mockReturnValue({user: mockUser});

    const screen = await render(
      <MemoryRouter>
        <HeaderComponent title={title} />
      </MemoryRouter>
    );

    const logoutMock = screen.getByTestId('logout-button-mock');

    expect(screen.getByRole('heading', {name: title})).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    expect(
      screen.getByRole('link', {name: 'Patients List'})
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {name: 'Pending Patients'})
    ).toBeInTheDocument();
    expect(logoutMock).toBeInTheDocument();
  });

  test('matches snapshot', async () => {
    const screen = await render(
      <MemoryRouter>
        <HeaderComponent title={title} />
      </MemoryRouter>
    );

    expect(screen.container.innerHTML).toMatchSnapshot();
  });
});
