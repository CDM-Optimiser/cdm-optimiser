import {useEffect, useId, useState} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui';
import {usePatientsContext} from '../features/patients/api/usePatientsContext.ts';
import {filterPatients} from '../features/patients/list/filterPatients.ts';
import {PatientsTableComponent} from '../features/patients/list/patients-table.component.tsx';
import {SearchPatientComponent} from '../features/patients/list/search-patient.component.tsx';
import {StatusFilterComponent} from '../features/patients/list/status-filter.component.tsx';
import {StatusLegendComponent} from '../features/patients/list/status-legend.component.tsx';
import type {StatusFilter} from '../features/patients/model/patient.ts';
import {PaginationComponent} from '../features/patients/pagination/pagination.component.tsx';
import {useDebounce} from '../hooks/useDebounce.ts';

export function PatientsListPageComponent() {
  const inputSearchID = useId();
  const [acceptedFilter, setAcceptedFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');

  const {
    patients,
    totalPatients,
    acceptedPatients,
    refusedPatients,
    pendingPatients,
    loading,
    error,
    setPatients,
    loadPatients,
  } = usePatientsContext();

  const debouncedSearchText = useDebounce(searchText, 500);

  useEffect(() => {
    const fetchPatients = async () => {
      await loadPatients(undefined, undefined, debouncedSearchText, 'all');
      setCurrentPage(1);
    };

    fetchPatients();
  }, [debouncedSearchText, loadPatients]);

  const {filteredPatients} = filterPatients(patients, acceptedFilter);

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const totalPages = Math.ceil(filteredPatients.length / resultsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleResultsPerPageChange = (newResultsPerPage: number) => {
    setResultsPerPage(newResultsPerPage);

    const newTotalPages = Math.ceil(
      filteredPatients.length / newResultsPerPage
    );

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
    }
  };

  const handleFilterChange = (filter: StatusFilter) => {
    setAcceptedFilter(filter);
    setCurrentPage(1);
  };

  return (
    <>
      <main className="mx-auto my-0 flex w-full max-w-7xl flex-col justify-center gap-6 p-6">
        {error && (
          <div className="mx-w-7xl mx-auto flex w-full items-center justify-center p-6">
            <AlertComponent
              type="error"
              title="Error getting patients"
              text={error}
            />
          </div>
        )}
        <SearchPatientComponent
          inputSearchID={inputSearchID}
          placeholder="Type to find a patient by its name, D.O.B or GMS number"
          value={searchText}
          onTextChange={setSearchText}
        />
        <div className="flex flex-wrap items-center justify-center gap-4 xl:justify-between">
          <StatusFilterComponent
            filterSelected={acceptedFilter}
            onFilterChange={handleFilterChange}
          />
          <StatusLegendComponent
            totalPatients={totalPatients}
            acceptedPatientsText={`Accepted (${acceptedPatients})`}
            refusedPatientsText={`Refused (${refusedPatients})`}
            pendingPatientsText={`Pending (${pendingPatients})`}
          />
        </div>
        {filteredPatients.length === 0 ? (
          <AlertComponent
            type="info"
            title="No patients found"
            text="No patients match your criteria"
          />
        ) : (
          <>
            {loading ? (
              <AlertComponent
                title="Loading patients"
                text="Fetching patients from database. It make take a few minutes..."
              />
            ) : (
              <>
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  resultsPerPage={resultsPerPage}
                  onPageChange={handlePageChange}
                  onResultsPerPageChange={handleResultsPerPageChange}
                />
                <PatientsTableComponent
                  patients={paginatedPatients}
                  onUpdatePatient={setPatients}
                />
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  resultsPerPage={resultsPerPage}
                  onPageChange={handlePageChange}
                  onResultsPerPageChange={setResultsPerPage}
                />
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
