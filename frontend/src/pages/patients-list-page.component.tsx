import {useId, useState} from 'react';
import {AlertComponent} from '../features/ui/alert.component.tsx';
import {LegendComponent} from '../features/patients-list/legend.component.tsx';
import {PaginationComponent} from '../features/patients-list/pagination.component.tsx';
import {PatientsListComponent} from '../features/patients-list/patients-list.component.tsx';
import {SearchPatientComponent} from '../features/patients-list/search-patient.component.tsx';
import {useInputChange} from '../utils/hooks/useInputChange.tsx';
import {useListPatients} from '../utils/hooks/useListPatients.tsx';
import {usePageChange} from '../utils/hooks/usePageChange.tsx';
import {useResultsPerPage} from '../utils/hooks/useResultsPerPage.tsx';
import {filterPatients} from '../utils/filterPatients.ts';
import {FiltersComponent} from '../features/patients-list/filters.component.tsx';

export function PatientsListPageComponent() {
  const inputSearchID = useId();
  const [acceptedFilter, setAcceptedFilter] = useState<
    'all' | 'accepted' | 'refused'
  >('all');

  const {patients} = useListPatients();
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

  const acceptedCount = patients.filter(
    (p) => p.called === '1' && p.accepted === '1'
  ).length;

  const refusedCount = patients.filter(
    (p) => p.called === '1' && p.accepted === '0'
  ).length;

  const pendingCount = patients.filter((p) => p.called === '0').length;

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
            {pageResults.length === 0 ? (
              <AlertComponent
                type="info"
                title="No patient/s found"
                text="There are no patient/s that matches your criteria."
              />
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* <div className="flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 shadow-md">
                    <span>Filters:</span>
                    <div className="flex gap-2">
                      <button
                        className={`rounded px-4 py-2 ${acceptedFilter === 'all' ? 'bg-sky-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleFilterChange('all')}
                      >
                        All
                      </button>
                      <button
                        className={`rounded px-4 py-2 ${acceptedFilter === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleFilterChange('accepted')}
                      >
                        Accepted
                      </button>
                      <button
                        className={`rounded px-4 py-2 ${acceptedFilter === 'refused' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleFilterChange('refused')}
                      >
                        Refused
                      </button>
                    </div>
                  </div> */}
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
                <PatientsListComponent
                  allPatients={patients}
                  patients={pageResults}
                />
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  resultsPerPage={resultsPerPage}
                  onPageChange={handlePageChange}
                  onResultsPerPageChange={handleResultsPerPage}
                />
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
