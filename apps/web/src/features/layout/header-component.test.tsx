import {describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {MemoryRouter} from 'react-router';
import {HeaderComponent} from './header-component.tsx';

vi.mock('../auth/use-auth.ts', () => ({
  useAuth: () => ({logout: vi.fn()}),
}));

function renderHeaderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <HeaderComponent title="CDM Optimiser" />
    </MemoryRouter>
  );
}

describe('HeaderComponent', () => {
  test('the brand links to the patients list and is not a heading', async () => {
    const screen = await renderHeaderAt('/pending-patients');

    await expect
      .element(screen.getByRole('link', {name: 'CDM Optimiser'}))
      .toHaveAttribute('href', '/');
    expect(screen.getByRole('heading').elements()).toHaveLength(0);
  });

  test('the main navigation marks the current page', async () => {
    const screen = await renderHeaderAt('/pending-patients');
    const nav = screen.getByRole('navigation', {name: 'Main'});

    await expect
      .element(nav.getByRole('link', {name: 'Pending Patients'}))
      .toHaveAttribute('aria-current', 'page');
    await expect
      .element(nav.getByRole('link', {name: 'Patients List'}))
      .not.toHaveAttribute('aria-current');
  });

  test('on the patients list, only that link is current', async () => {
    const screen = await renderHeaderAt('/');
    const nav = screen.getByRole('navigation', {name: 'Main'});

    await expect
      .element(nav.getByRole('link', {name: 'Patients List'}))
      .toHaveAttribute('aria-current', 'page');
    await expect
      .element(nav.getByRole('link', {name: 'Pending Patients'}))
      .not.toHaveAttribute('aria-current');
  });

  test('offers logout, and no theme menu outside the desktop app', async () => {
    const screen = await renderHeaderAt('/');

    await expect
      .element(screen.getByRole('button', {name: 'Logout'}))
      .toBeVisible();
    expect(
      screen.getByRole('button', {name: /^Theme:/}).elements()
    ).toHaveLength(0);
  });
});
