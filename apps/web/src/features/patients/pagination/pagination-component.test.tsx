import {afterEach, describe, expect, test, vi} from 'vitest';
import {page} from 'vitest/browser';
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
  afterEach(async () => {
    await page.viewport(1280, 800);
  });

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

  test('on a phone, shows the page between the arrows instead of numbers', async () => {
    await page.viewport(390, 844);
    const {screen, onPageChange} = renderPagination(2, 5);
    const view = await screen;
    const pages = view.getByRole('navigation', {name: 'Pagination'});

    await expect.element(pages.getByText('Page 2 of 5')).toBeVisible();
    expect(pages.getByRole('button', {name: /^Page \d/}).query()).toBeNull();

    await pages.getByRole('button', {name: 'Next page'}).click();

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('changes the page size', async () => {
    const {screen, onResultsPerPageChange} = renderPagination(1, 5);
    const view = await screen;

    await view.getByLabelText('Patients per page:').selectOptions('25');

    expect(onResultsPerPageChange).toHaveBeenCalledWith(25);
  });
});
