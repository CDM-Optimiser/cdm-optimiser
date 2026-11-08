import {useId} from 'react';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import {ChevronLeftIcon} from '@cdm-optimiser/ui/icons/chevron-left-icon.tsx';
import {ChevronRightIcon} from '@cdm-optimiser/ui/icons/chevron-right-icon.tsx';
import {getVisiblePages} from './get-visible-pages.ts';
import {PageSizeSelectComponent} from './page-size-select-component.tsx';

interface PaginationProps {
  /** Names the page links for screen readers; unique on the page. */
  label?: string;
  currentPage: number;
  totalPages: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  onResultsPerPageChange: (results: number) => void;
}

/**
 * Room for two digits, so the buttons don't change width between pages.
 * Phones have no room for the numbers: they get "Page X of Y" between the
 * arrows instead.
 */
const PAGE_BUTTON = 'hidden min-w-12 px-3 sm:inline-block';

/**
 * The page buttons, as the filters: the current page is filled in the
 * primary colour and marked with `aria-current`, the others are secondary.
 *
 * Wide screens (`lg`) show one row: where you are, the page buttons, the
 * page size. Smaller screens put the page buttons on their own row, with
 * the other two below; `lg:contents` lets that lower row join the card's
 * single row on wide screens.
 */
export function PaginationComponent({
  label = 'Pagination',
  currentPage,
  totalPages,
  resultsPerPage,
  onPageChange,
  onResultsPerPageChange,
}: PaginationProps) {
  const pageSizeSelectId = useId();

  return (
    <CardComponent className="flex w-full flex-col items-center gap-4 sm:px-8 lg:flex-row lg:justify-between">
      <nav
        aria-label={label}
        className="flex items-center gap-1 whitespace-nowrap lg:order-2"
      >
        <ButtonComponent
          variant="secondary"
          className="px-3"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="sr-only">Previous page</span>
          <ChevronLeftIcon />
        </ButtonComponent>
        <span className="px-3 sm:hidden">
          Page {currentPage} of {totalPages}
        </span>
        {getVisiblePages(currentPage, totalPages).map((item) =>
          typeof item === 'number' ? (
            <ButtonComponent
              key={item}
              variant={item === currentPage ? 'primary' : 'secondary'}
              aria-current={item === currentPage ? 'page' : undefined}
              className={PAGE_BUTTON}
              onClick={() => onPageChange(item)}
            >
              <span className="sr-only">Page </span>
              {item}
            </ButtonComponent>
          ) : (
            <span
              key={item}
              aria-hidden="true"
              className="hidden px-2 sm:inline"
            >
              …
            </span>
          )
        )}
        <ButtonComponent
          variant="secondary"
          className="px-3"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon />
          <span className="sr-only">Next page</span>
        </ButtonComponent>
      </nav>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 whitespace-nowrap lg:contents">
        {/* Phones already show the page between the arrows. */}
        <span className="hidden sm:inline lg:order-1">
          Showing page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2 lg:order-3">
          <PageSizeSelectComponent
            selectIDAndName={pageSizeSelectId}
            resultsPerPage={resultsPerPage}
            onChange={(event) =>
              onResultsPerPageChange(Number(event.currentTarget.value))
            }
          />
        </div>
      </div>
    </CardComponent>
  );
}
