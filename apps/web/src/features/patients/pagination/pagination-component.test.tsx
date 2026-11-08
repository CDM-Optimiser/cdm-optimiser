import {describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {PaginationComponent} from './pagination-component.tsx';

function renderPagination(currentPage: number, totalPages: number) {
  const onPageChange = vi.fn();
  const onResultsPerPageChange = vi.fn();

  const screen = render(
    <PaginationComponent
      currentPage={currentPage}
      totalPages={totalPages}
      resultsPerPage={10}
      onPageChange={onPageChange}
      onResultsPerPageChange={onResultsPerPageChange}
    />
  );

  return {screen, onPageChange, onResultsPerPageChange};
}

describe('PaginationComponent', () => {
  test('on the first page, Previous is disabled and Next moves on', async () => {
    const {screen, onPageChange} = renderPagination(1, 5);
    const view = await screen;

    await expect
      .element(view.getByRole('button', {name: 'Previous page'}))
      .toBeDisabled();
    await view.getByRole('button', {name: 'Next page'}).click();

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('on the last page, Next is disabled', async () => {
    const view = await renderPagination(5, 5).screen;

    await expect
      .element(view.getByRole('button', {name: 'Next page'}))
      .toBeDisabled();
    await expect.element(view.getByText('Showing page 5 of 5')).toBeVisible();
  });

  test('marks the current page and jumps to another', async () => {
    const {screen, onPageChange} = renderPagination(5, 10);
    const view = await screen;
    const pages = view.getByRole('navigation', {name: 'Pagination'});

    await expect
      .element(pages.getByRole('button', {name: 'Page 5', exact: true}))
      .toHaveAttribute('aria-current', 'page');
    await expect
      .element(pages.getByRole('button', {name: 'Page 4', exact: true}))
      .not.toHaveAttribute('aria-current');
    await pages.getByRole('button', {name: 'Page 10', exact: true}).click();

    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  test('changes the page size', async () => {
    const {screen, onResultsPerPageChange} = renderPagination(1, 5);
    const view = await screen;

    await view.getByLabelText('Patients per page:').selectOptions('25');

    expect(onResultsPerPageChange).toHaveBeenCalledWith(25);
  });
});
