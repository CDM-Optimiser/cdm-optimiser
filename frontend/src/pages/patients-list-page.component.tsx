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
import {usePatientsContext} from '../utils/hooks/usePatientsContext.tsx';

export function PatientsListPageComponent() {
  const inputSearchID = useId();
  const [acceptedFilter, setAcceptedFilter] = useState<
    'all' | 'accepted' | 'refused' | 'pending'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);

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

  const {resultsPerPage, handleResultsPerPage} = useResultsPerPage();
  const {searchText, handleInputChange} = useInputChange();
  const debouncedSearchText = useDebounce(searchText, 500);

  useEffect(() => {
    const fetchPatients = async () => {
      const offset = (currentPage - 1) * resultsPerPage;
      await loadPatients(
        resultsPerPage,
        offset,
        debouncedSearchText,
        acceptedFilter
      );
    };

    fetchPatients();
  }, [
    debouncedSearchText,
    acceptedFilter,
    currentPage,
    resultsPerPage,
    loadPatients,
  ]);

  const totalPages = Math.ceil(totalPatients / resultsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleResultsPerPageChange = (newResultsPerPage: number) => {
    handleResultsPerPage(newResultsPerPage);

    setCurrentPage(1);
  };

  const handleFilterChange = (
    filter: 'all' | 'accepted' | 'refused' | 'pending'
  ) => {
    setAcceptedFilter(filter);
    setCurrentPage(1);
  };

  const handleTextChange = (text: string) => handleInputChange(text);

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
        {totalPatients === 0 ? (
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
                <PatientsListComponent
                  patients={patients}
                  onUpdatePatient={setPatients}
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
          </>
        )}
      </main>
    </>
  );
}
