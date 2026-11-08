import {afterEach, describe, expect, test, vi} from 'vitest';
import {page} from 'vitest/browser';
import {render} from 'vitest-browser-react';
import {StatusFilterComponent} from './status-filter-component.tsx';

describe('StatusFilterComponent', () => {
  afterEach(async () => {
    await page.viewport(1280, 800);
  });

  describe('on a wide screen', () => {
    test('marks the selected filter as pressed', async () => {
      const screen = await render(
        <StatusFilterComponent
          filterSelected="refused"
          onFilterChange={vi.fn()}
        />
      );

      await expect
        .element(screen.getByRole('group', {name: 'Filters:'}))
        .toBeVisible();
      await expect
        .element(screen.getByRole('button', {name: 'Refused patients'}))
        .toHaveAttribute('aria-pressed', 'true');
      await expect
        .element(screen.getByRole('button', {name: 'All'}))
        .toHaveAttribute('aria-pressed', 'false');
      // The small-screen button is hidden, so out of role queries.
      expect(
        screen.getByRole('button', {name: /^Filters:/}).query()
      ).toBeNull();
    });

    test('reports the filter that was chosen', async () => {
      const onFilterChange = vi.fn();
      const screen = await render(
        <StatusFilterComponent
          filterSelected="all"
          onFilterChange={onFilterChange}
        />
      );

      await screen.getByRole('button', {name: 'Pending patients'}).click();

      expect(onFilterChange).toHaveBeenCalledWith('pending');
    });
  });

  describe('on a small screen', () => {
    test('a button names the current filter, instead of the card', async () => {
      await page.viewport(390, 844);
      const screen = await render(
        <StatusFilterComponent
          filterSelected="accepted"
          onFilterChange={vi.fn()}
        />
      );

      await expect
        .element(
          screen.getByRole('button', {name: 'Filters: Accepted patients'})
        )
        .toBeVisible();
      expect(screen.getByRole('group', {name: 'Filters:'}).query()).toBeNull();
    });

    test('the drawer offers every filter and closes once one is chosen', async () => {
      await page.viewport(390, 844);
      const onFilterChange = vi.fn();
      const screen = await render(
        <StatusFilterComponent
          filterSelected="all"
          onFilterChange={onFilterChange}
        />
      );

      await screen.getByRole('button', {name: 'Filters: All'}).click();

      const drawer = screen.getByRole('dialog', {name: 'Filters'});
      const group = drawer.getByRole('group', {
        name: 'Filter patients by status',
      });

      await expect
        .element(group.getByRole('button', {name: 'All'}))
        .toHaveAttribute('aria-pressed', 'true');

      await group.getByRole('button', {name: 'Refused patients'}).click();

      expect(onFilterChange).toHaveBeenCalledWith('refused');
      await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
