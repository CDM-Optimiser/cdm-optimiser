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

/** Room for two digits, so the buttons don't change width between pages. */
const PAGE_BUTTON = 'min-w-12 px-3';

/**
 * The page buttons, as the filters: the current page is filled in the
 * primary colour and marked with `aria-current`, the others are secondary.
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
    <CardComponent className="flex w-full flex-wrap items-center justify-center gap-4 px-8 md:flex-nowrap md:justify-between">
      <span>
        Showing page {currentPage} of {totalPages}
      </span>
      <nav aria-label={label} className="flex flex-wrap items-center gap-1">
        <ButtonComponent
          variant="secondary"
          className="px-3"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="sr-only">Previous page</span>
          <ChevronLeftIcon />
        </ButtonComponent>
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
            <span key={item} aria-hidden="true" className="px-2">
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
      <div className="flex items-center justify-center gap-2">
        <PageSizeSelectComponent
          selectIDAndName={pageSizeSelectId}
          resultsPerPage={resultsPerPage}
          onChange={(event) =>
            onResultsPerPageChange(Number(event.currentTarget.value))
          }
        />
      </div>
    </CardComponent>
  );
}
