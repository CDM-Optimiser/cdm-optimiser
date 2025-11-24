import { useId, type ChangeEvent, type MouseEvent } from 'react';
import { getVisiblePages } from '../../utils/getVisiblePagesButtons.ts';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  resultsPerPage: number;
  onPageChange?: (page: number) => void;
  onResultsPerPageChange?: (results: number) => void;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  resultsPerPage,
  onPageChange = () => { },
  onResultsPerPageChange = () => { },
}: PaginationProps) {
  const selectResultsPerPageID = useId();
  const pagesToRender = getVisiblePages(currentPage, totalPages);

  const handlePrevClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleChangePage = (event: MouseEvent<HTMLButtonElement>) => {
    const page = Number(event.currentTarget.dataset.pageNumber);

    if (!isNaN(page) && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleChangeResultsPerPage = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const results = Number(event?.currentTarget.value);
    onResultsPerPageChange(results);
  };

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4 rounded-xl bg-white px-8 py-4 shadow-md md:flex-nowrap md:justify-between dark:bg-white/5 dark:ring dark:ring-gray-600">
      <div className="isolate inline-flex">
        <button
          type="button"
          data-page-number={currentPage - 1}
          className="relative inline-flex items-center rounded-s-md bg-white px-3 py-2 font-medium text-gray-900 ring-1 ring-gray-200 transition duration-200 ease-in-out hover:bg-sky-500 hover:ring-sky-200 hover:not-disabled:text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:bg-white/5 dark:text-white"
          disabled={currentPage === 1}
          onClick={handlePrevClick}
        >
          <span className="sr-only">Previous patient</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 6l-6 6l6 6" />
          </svg>
        </button>
        {pagesToRender.map((page, index) => {
          if (page === '…') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="relative inline-flex w-12 items-center justify-center bg-white px-3 py-2 font-medium text-gray-900 ring-1 ring-gray-200 dark:bg-white/5 dark:text-white"
              >
                …
              </span>
            );
          }

          const buttonsClassName = `${currentPage === page
              ? 'bg-sky-200 disabled:bg-sky-500 text-white'
              : 'bg-white'
            }`.trim();

          return (
            <button
              key={page}
              type="button"
              data-page-number={page}
              className={`relative inline-flex w-12 items-center justify-center ${buttonsClassName} px-3 py-2 font-medium text-gray-900 ring-1 ring-gray-200 transition duration-200 ease-in-out hover:not-disabled:bg-sky-500 hover:not-disabled:text-white disabled:cursor-not-allowed dark:bg-white/5 dark:text-white dark:hover:not-disabled:bg-sky-500 dark:hover:not-disabled:ring-sky-200`}
              disabled={currentPage === page}
              onClick={handleChangePage}
            >
              {page}
            </button>
          );
        })}
        <button
          type="button"
          data-page-number={currentPage + 1}
          className="relative inline-flex items-center rounded-e-md bg-white px-3 py-2 font-medium text-gray-900 ring-1 ring-gray-200 transition duration-200 ease-in-out hover:bg-sky-500 hover:ring-sky-200 hover:not-disabled:text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:bg-white/5 dark:text-white"
          disabled={currentPage === totalPages}
          onClick={handleNextClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6l6 6l-6 6" />
          </svg>
          <span className="sr-only">Next patient</span>
        </button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <label htmlFor={selectResultsPerPageID}>Patients per page:</label>
        <select
          id={selectResultsPerPageID}
          name={selectResultsPerPageID}
          value={resultsPerPage}
          className="rounded-md bg-white px-2 py-1 ring ring-gray-400 dark:bg-white/5"
          onChange={handleChangeResultsPerPage}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
      <span>
        Showing page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
