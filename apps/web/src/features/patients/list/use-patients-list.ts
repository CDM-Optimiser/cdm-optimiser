import {useState} from 'react';
import {useDebounce} from '../../../hooks/use-debounce.ts';
import type {StatusFilter} from '../model/patient.ts';
import {usePatientsPage} from '../api/use-patients-page.ts';

/**
 * The patients list: what the user has chosen (search, status filter, page,
 * page size) and the page of patients that matches it. Changing the search,
 * filter or page size goes back to page 1.
 */
export function usePatientsList() {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const search = useDebounce(searchText, 500);

  const query = usePatientsPage({search, status, page, pageSize});
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // After a save the list can shrink below the current page (for example the
  // last pending patient on the last page): move to the new last page.
  // Adjusting state while rendering is React's pattern for this; it re-renders
  // straight away, before anything is shown.
  if (query.data && !query.isPlaceholderData && page > totalPages) {
    setPage(totalPages);
  }

  return {
    query,
    searchText,
    status,
    page,
    pageSize,
    total,
    totalPages,
    setPage,
    changeSearch: (text: string) => {
      setSearchText(text);
      setPage(1);
    },
    changeStatus: (next: StatusFilter) => {
      setStatus(next);
      setPage(1);
    },
    changePageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
  };
}
