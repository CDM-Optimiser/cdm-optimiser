import {describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {StatusFilterComponent} from './status-filter-component.tsx';

describe('StatusFilterComponent', () => {
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
