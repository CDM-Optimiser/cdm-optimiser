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
import {usePatients} from '../api/usePatients.ts';

export function PatientsListPageComponent() {
  const inputSearchID = useId();
  const [acceptedFilter, setAcceptedFilter] = useState<
    'all' | 'accepted' | 'refused'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);

  const {resultsPerPage, handleResultsPerPage} = useResultsPerPage();
  const {searchText, handleInputChange} = useInputChange();
  const debouncedSearchText = useDebounce(searchText, 400);

  const offset = (currentPage - 1) * resultsPerPage;
  const limit = resultsPerPage;

  const {patients, totalPatients, loading, error} = usePatients(
    limit,
    offset,
    debouncedSearchText,
    currentPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText, acceptedFilter, resultsPerPage]);

  const {filteredPatients} = filterPatients(patients, acceptedFilter);

  const totalPages = Math.ceil(totalPatients / resultsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleFilterChange = (filter: 'all' | 'accepted' | 'refused') => {
    setAcceptedFilter(filter);
    handlePageChange(1);
  };

  const handleTextChange = (text: string) => {
    handleInputChange(text);
    handlePageChange(1);
  };

  const acceptedCount = patients.filter((patient) => patient.accepted).length;
  const refusedCount = patients.filter((patient) => patient.refused).length;
  const pendingCount = patients.filter(
    (patient) => !patient.accepted && !patient.refused
  ).length;

  return (
    <main className="mx-auto my-0 flex w-full max-w-7xl flex-col justify-center p-6">
      <SearchPatientComponent
        inputSearchID={inputSearchID}
        placeholder="Type to find a patient by its name, D.O.B or GMS number"
        onTextChange={handleTextChange}
      />
      <section>
        <div className="py-2">
          <article>
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-center gap-4 xl:justify-between">
                <FiltersComponent
                  filterSelected={acceptedFilter}
                  onFilterChange={handleFilterChange}
                />
                <LegendComponent
                  totalPatients={totalPatients}
                  acceptedPatientsText={`Accepted patients (${acceptedCount})`}
                  refusedPatientsText={`Refused patients (${refusedCount})`}
                  pendingPatientsText={`Pending patients (${pendingCount})`}
                />
              </div>
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                resultsPerPage={resultsPerPage}
                onPageChange={handlePageChange}
                onResultsPerPageChange={handleResultsPerPage}
              />
              {error && (
                <AlertComponent
                  type="error"
                  text={error}
                  title="Error getting patients from database"
                />
              )}
              {loading && (
                <AlertComponent
                  title="Loading patients.."
                  text="Fetching patients. This may take a few minutes."
                />
              )}
              {!loading && !error && filteredPatients.length === 0 && (
                <AlertComponent
                  type="info"
                  title="No patient/s found"
                  text="There are no patient/s that matches your criteria."
                />
              )}
              {!loading && !error && filteredPatients.length > 0 && (
                <PatientsListComponent
                  allPatients={patients}
                  patients={filteredPatients}
                />
              )}
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                resultsPerPage={resultsPerPage}
                onPageChange={handlePageChange}
                onResultsPerPageChange={handleResultsPerPage}
              />
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
