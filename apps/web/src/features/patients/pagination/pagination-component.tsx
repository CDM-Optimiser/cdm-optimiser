import {useId} from 'react';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import {ChevronLeftIcon} from '@cdm-optimiser/ui/icons/chevron-left-icon.tsx';
import {ChevronRightIcon} from '@cdm-optimiser/ui/icons/chevron-right-icon.tsx';
import {getVisiblePages} from './get-visible-pages.ts';
import {PageSizeSelectComponent} from './page-size-select-component.tsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  onResultsPerPageChange: (results: number) => void;
}

const PAGE_BUTTON =
  'relative inline-flex items-center justify-center px-3 py-2 font-medium text-gray-900 ring-1 ring-gray-200 transition duration-200 ease-in-out disabled:cursor-not-allowed dark:bg-white/5 dark:text-white';

const ARROW_BUTTON = `${PAGE_BUTTON} bg-white hover:not-disabled:bg-sky-500 hover:not-disabled:text-white disabled:bg-gray-200 disabled:text-gray-400`;

export function PaginationComponent({
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
      <div className="isolate inline-flex">
        <button
          type="button"
          className={`${ARROW_BUTTON} rounded-s-md`}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="sr-only">Previous page</span>
          <ChevronLeftIcon />
        </button>
        {getVisiblePages(currentPage, totalPages).map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              className={`${PAGE_BUTTON} w-12 ${
                item === currentPage
                  ? 'bg-sky-500 text-white dark:bg-sky-500'
                  : 'bg-white hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500'
              }`}
              disabled={item === currentPage}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ) : (
            <span key={item} className={`${PAGE_BUTTON} w-12 bg-white`}>
              …
            </span>
          )
        )}
        <button
          type="button"
          className={`${ARROW_BUTTON} rounded-e-md`}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon />
          <span className="sr-only">Next page</span>
        </button>
      </div>
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
