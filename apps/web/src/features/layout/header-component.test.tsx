import {afterEach, describe, expect, test, vi} from 'vitest';
import {page} from 'vitest/browser';
import {render} from 'vitest-browser-react';
import {MemoryRouter} from 'react-router';
import {HeaderComponent} from './header-component.tsx';

vi.mock('../auth/use-auth.ts', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: {
      email: 'test.user@example.com',
      user_metadata: {display_name: 'Test User'},
    },
  }),
}));

function renderHeaderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <HeaderComponent title="CDM Optimiser" />
    </MemoryRouter>
  );
}

describe('HeaderComponent', () => {
  afterEach(async () => {
    await page.viewport(1280, 800);
  });

  describe('on a wide screen', () => {
    test('the brand links to the patients list and is not a heading', async () => {
      await page.viewport(1280, 800);
      const screen = await renderHeaderAt('/pending-patients');

      await expect
        .element(screen.getByRole('link', {name: 'CDM Optimiser'}))
        .toHaveAttribute('href', '/');
      expect(screen.getByRole('heading').elements()).toHaveLength(0);
    });

    test('the main navigation marks the current page', async () => {
      await page.viewport(1280, 800);
      const screen = await renderHeaderAt('/pending-patients');
      const nav = screen.getByRole('navigation', {name: 'Main'});

      await expect
        .element(nav.getByRole('link', {name: 'Pending Patients'}))
        .toHaveAttribute('aria-current', 'page');
      await expect
        .element(nav.getByRole('link', {name: 'Patients List'}))
        .not.toHaveAttribute('aria-current');
    });

    test('shows who is signed in, and Logout, with no menu button', async () => {
      await page.viewport(1280, 800);
      const screen = await renderHeaderAt('/');

      await expect
        .element(screen.getByText('Signed in as Test User'))
        .toBeVisible();
      await expect
        .element(screen.getByRole('button', {name: 'Logout'}))
        .toBeVisible();
      // Hidden elements are left out of role queries, as from screen
      // readers.
      expect(
        screen.getByRole('button', {name: 'Open menu'}).query()
      ).toBeNull();
    });

    test('has no theme menu outside the desktop app', async () => {
      await page.viewport(1280, 800);
      const screen = await renderHeaderAt('/');

      expect(
        screen.getByRole('button', {name: /^Theme:/}).elements()
      ).toHaveLength(0);
    });
  });

  describe('on a small screen', () => {
    test('hides the links behind a menu button', async () => {
      await page.viewport(390, 844);
      const screen = await renderHeaderAt('/');

      await expect
        .element(screen.getByRole('button', {name: 'Open menu'}))
        .toBeVisible();
      expect(
        screen.getByRole('link', {name: 'Patients List'}).query()
      ).toBeNull();
    });

    test('the menu opens a drawer with the links, the user and Logout', async () => {
      await page.viewport(390, 844);
      const screen = await renderHeaderAt('/');

      await screen.getByRole('button', {name: 'Open menu'}).click();

      const drawer = screen.getByRole('dialog', {name: 'Menu'});

      await expect.element(drawer).toBeVisible();
      await expect
        .element(drawer.getByRole('link', {name: 'Patients List'}))
        .toHaveAttribute('aria-current', 'page');
      await expect
        .element(drawer.getByText('Signed in as Test User'))
        .toBeVisible();
      await expect
        .element(drawer.getByRole('button', {name: 'Logout'}))
        .toBeVisible();
    });

    test('choosing a link closes the drawer', async () => {
      await page.viewport(390, 844);
      const screen = await renderHeaderAt('/');

      await screen.getByRole('button', {name: 'Open menu'}).click();
      await screen
        .getByRole('dialog', {name: 'Menu'})
        .getByRole('link', {name: 'Pending Patients'})
        .click();

      await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
    });

    test('the drawer closes when the window becomes wide', async () => {
      await page.viewport(390, 844);
      const screen = await renderHeaderAt('/');

      await screen.getByRole('button', {name: 'Open menu'}).click();
      await expect
        .element(screen.getByRole('dialog', {name: 'Menu'}))
        .toBeVisible();

      await page.viewport(1280, 800);

      await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
