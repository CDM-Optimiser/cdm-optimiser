import {useEffect, useId, useState} from 'react';
import {AlertComponent} from '../features/ui/alert.component.tsx';
import {FiltersComponent} from '../features/patients-list/filters.component.tsx';
import {LegendComponent} from '../features/patients-list/legend.component.tsx';
import {PaginationComponent} from '../features/patients-list/pagination.component.tsx';
import {PatientsListComponent} from '../features/patients-list/patients-list.component.tsx';
import {SearchPatientComponent} from '../features/patients-list/search-patient.component.tsx';
import {useDebounce} from '../utils/hooks/useDebounce.tsx';
import {useInputChange} from '../utils/hooks/useInputChange.tsx';
import {useResultsPerPage} from '../utils/hooks/useResultsPerPage.tsx';
import {filterPatients} from '../utils/filterPatients.ts';
import {usePatientsContext} from '../utils/hooks/patientsContext.tsx';

export function PatientsListPageComponent() {
  const inputSearchID = useId();
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

  const [acceptedFilter, setAcceptedFilter] = useState<
    'all' | 'accepted' | 'refused' | 'pending'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);

  const {resultsPerPage, handleResultsPerPage} = useResultsPerPage();
  const {searchText, handleInputChange} = useInputChange();
  const debouncedSearchText = useDebounce(searchText, 400);

  // Fetch all patients for filtering whenever search text changes
  useEffect(() => {
    loadPatients(undefined, undefined, debouncedSearchText, 'all');
    setCurrentPage(1);
  }, [debouncedSearchText, loadPatients]);

  // Filter patients according to acceptedFilter
  const {filteredPatients} = filterPatients(patients, acceptedFilter);

  // Slice for pagination
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const totalPages = Math.ceil(filteredPatients.length / resultsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleFilterChange = (
    filter: 'all' | 'accepted' | 'refused' | 'pending'
  ) => {
    setAcceptedFilter(filter);
    setCurrentPage(1);
  };
  const handleTextChange = (text: string) => handleInputChange(text);

  return (
    <main className="mx-auto my-0 flex w-full max-w-7xl flex-col justify-center gap-6 p-6">
      <SearchPatientComponent
        inputSearchID={inputSearchID}
        placeholder="Type to find a patient by its name, D.O.B or GMS number"
        value={searchText}
        onTextChange={handleTextChange}
      />

      <div className="flex flex-wrap items-center justify-center gap-4 xl:justify-between">
        <FiltersComponent
          filterSelected={acceptedFilter}
          onFilterChange={handleFilterChange}
        />
        <LegendComponent
          totalPatients={totalPatients}
          acceptedPatientsText={`Accepted (${acceptedPatients})`}
          refusedPatientsText={`Refused (${refusedPatients})`}
          pendingPatientsText={`Pending (${pendingPatients})`}
        />
      </div>

      {error && (
        <AlertComponent
          type="error"
          text={error}
          title="Error getting patients"
        />
      )}
      {loading && (
        <AlertComponent text="Fetching patients..." title="Loading patients" />
      )}
      {!loading && filteredPatients.length === 0 && !error && (
        <AlertComponent
          type="info"
          text="No patients match your criteria"
          title="No patients found"
        />
      )}

      {!loading && filteredPatients.length > 0 && (
        <>
          <PatientsListComponent
            patients={paginatedPatients}
            onUpdatePatients={setPatients}
          />
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            resultsPerPage={resultsPerPage}
            onPageChange={handlePageChange}
            onResultsPerPageChange={handleResultsPerPage}
          />
        </>
      )}
    </main>
  );
}
