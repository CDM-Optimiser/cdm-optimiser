import {useId, useState} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {usePatientCounts} from '../features/patients/api/use-patient-counts.ts';
import {usePatientsPage} from '../features/patients/api/use-patients-page.ts';
import {PatientsTableComponent} from '../features/patients/list/patients-table-component.tsx';
import {SearchPatientComponent} from '../features/patients/list/search-patient-component.tsx';
import {StatusFilterComponent} from '../features/patients/list/status-filter-component.tsx';
import {StatusLegendComponent} from '../features/patients/list/status-legend-component.tsx';
import type {StatusFilter} from '../features/patients/model/patient.ts';
import {PaginationComponent} from '../features/patients/pagination/pagination-component.tsx';
import {useDebounce} from '../hooks/use-debounce.ts';
import {getErrorMessage} from '../lib/get-error-message.ts';

export function PatientsListPageComponent() {
  const inputSearchID = useId();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const search = useDebounce(searchText, 500);

  const patientsPage = usePatientsPage({search, status, page, pageSize});
  const counts = usePatientCounts();

  const total = patientsPage.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // After a save, the list can shrink below the current page (for example
  // the last pending patient on the last page). Move to the new last page.
  // Adjusting state while rendering is React's pattern for this; it re-renders
  // straight away, before anything is shown.
  if (
    patientsPage.data &&
    !patientsPage.isPlaceholderData &&
    page > totalPages
  ) {
    setPage(totalPages);
  }

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setPage(1);
  };

  const handleFilterChange = (filter: StatusFilter) => {
    setStatus(filter);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const pagination = (
    <PaginationComponent
      currentPage={page}
      totalPages={totalPages}
      resultsPerPage={pageSize}
      onPageChange={setPage}
      onResultsPerPageChange={handlePageSizeChange}
    />
  );

  return (
    <>
      <SearchPatientComponent
        inputSearchID={inputSearchID}
        placeholder="Type to find a patient by name, D.O.B. or GMS number"
        value={searchText}
        onTextChange={handleSearchChange}
      />
      <div className="flex flex-wrap items-center justify-center gap-4 xl:justify-between">
        <StatusFilterComponent
          filterSelected={status}
          onFilterChange={handleFilterChange}
        />
        <StatusLegendComponent
          totalPatients={counts.data?.total ?? 0}
          acceptedPatientsText={`Accepted (${counts.data?.accepted ?? 0})`}
          refusedPatientsText={`Refused (${counts.data?.refused ?? 0})`}
          pendingPatientsText={`Pending (${counts.data?.pending ?? 0})`}
        />
      </div>
      {patientsPage.isError ? (
        <AlertComponent
          type="error"
          title="Error getting patients"
          text={getErrorMessage(patientsPage.error)}
        />
      ) : patientsPage.isPending ? (
        <AlertComponent title="Loading patients" text="Loading patients…" />
      ) : total === 0 ? (
        <AlertComponent
          type="info"
          title="No patients found"
          text="No patients match your criteria"
        />
      ) : (
        <>
          {pagination}
          <div
            aria-busy={patientsPage.isPlaceholderData}
            className={
              patientsPage.isPlaceholderData
                ? 'opacity-60 transition-opacity'
                : 'transition-opacity'
            }
          >
            <PatientsTableComponent patients={patientsPage.data.patients} />
          </div>
          {pagination}
        </>
      )}
    </>
  );
}
