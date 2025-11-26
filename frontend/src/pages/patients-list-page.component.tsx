import {useId, useState} from 'react';
import {AlertComponent} from '../features/ui/alert.component.tsx';
import {FiltersComponent} from '../features/patients-list/filters.component.tsx';
import {LegendComponent} from '../features/patients-list/legend.component.tsx';
import {PaginationComponent} from '../features/patients-list/pagination.component.tsx';
import {PatientsListComponent} from '../features/patients-list/patients-list.component.tsx';
import {SearchPatientComponent} from '../features/patients-list/search-patient.component.tsx';
import {useInputChange} from '../utils/hooks/useInputChange.tsx';
import {usePageChange} from '../utils/hooks/usePageChange.tsx';
import {useResultsPerPage} from '../utils/hooks/useResultsPerPage.tsx';
import {filterPatients} from '../utils/filterPatients.ts';
import {usePatients} from '../api/patients.ts';

export function PatientsListPageComponent() {
  const inputSearchID = useId();
  const [acceptedFilter, setAcceptedFilter] = useState<
    'all' | 'accepted' | 'refused'
  >('all');

  const {patients} = usePatients();
  const {searchText, handleInputChange} = useInputChange();
  const {currentPage, handlePageChange} = usePageChange();
  const {resultsPerPage, handleResultsPerPage} = useResultsPerPage();
  const {totalPages, pageResults} = filterPatients(
    resultsPerPage,
    searchText,
    patients,
    currentPage,
    acceptedFilter
  );

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
                  totalPatients={patients.length}
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
              {pageResults.length === 0 ? (
                <AlertComponent
                  type="info"
                  title="No patient/s found"
                  text="There are no patient/s that matches your criteria."
                />
              ) : (
                <PatientsListComponent
                  allPatients={patients}
                  patients={pageResults}
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
