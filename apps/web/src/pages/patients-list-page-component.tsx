import {useId, useState} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {ModalComponent} from '@cdm-optimiser/ui/components/modal-component.tsx';
import {usePatientCounts} from '../features/patients/api/use-patient-counts.ts';
import {PatientCardComponent} from '../features/patients/card/patient-card-component.tsx';
import {PatientsTableComponent} from '../features/patients/list/patients-table-component.tsx';
import {SearchPatientComponent} from '../features/patients/list/search-patient-component.tsx';
import {StatusFilterComponent} from '../features/patients/list/status-filter-component.tsx';
import {StatusLegendComponent} from '../features/patients/list/status-legend-component.tsx';
import {usePatientsList} from '../features/patients/list/use-patients-list.ts';
import type {Patient} from '../features/patients/model/patient.ts';
import {PaginationComponent} from '../features/patients/pagination/pagination-component.tsx';
import {getErrorMessage} from '../lib/get-error-message.ts';

export function PatientsListPageComponent() {
  const searchId = useId();
  const list = usePatientsList();
  const counts = usePatientCounts();
  const [selected, setSelected] = useState<Patient | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleUpdated = (patient: Patient) => {
    setSelected(null);
    setLastUpdated(patient.name);
  };

  // The same bar above and below the table, named apart for screen readers.
  const pagination = (position: 'top' | 'bottom') => (
    <PaginationComponent
      label={`Pagination, ${position}`}
      currentPage={list.page}
      totalPages={list.totalPages}
      resultsPerPage={list.pageSize}
      onPageChange={list.setPage}
      onResultsPerPageChange={list.changePageSize}
    />
  );

  return (
    <>
      <h1 className="text-2xl font-semibold">Patients</h1>
      <SearchPatientComponent
        inputSearchID={searchId}
        placeholder="Type to find a patient by name, D.O.B. or GMS number"
        value={list.searchText}
        onTextChange={list.changeSearch}
      />
      {/* Side by side on wide screens, stretched to the same height. */}
      <div className="flex flex-wrap items-stretch justify-center gap-4 xl:justify-between">
        <StatusFilterComponent
          filterSelected={list.status}
          onFilterChange={list.changeStatus}
        />
        <StatusLegendComponent counts={counts.data} />
      </div>
      {list.query.isError ? (
        <AlertComponent
          type="error"
          title="Error getting patients"
          text={getErrorMessage(list.query.error)}
        />
      ) : list.query.isPending ? (
        <AlertComponent title="Loading patients" text="Loading patients…" />
      ) : list.total === 0 ? (
        <AlertComponent
          type="info"
          title="No patients found"
          text="No patients match your criteria"
        />
      ) : (
        <>
          {pagination('top')}
          <div
            aria-busy={list.query.isPlaceholderData}
            className={`transition-opacity ${list.query.isPlaceholderData ? 'opacity-60' : ''}`}
          >
            <PatientsTableComponent
              patients={list.query.data.patients}
              onOpen={setSelected}
            />
          </div>
          {pagination('bottom')}
        </>
      )}
      <ModalComponent
        isOpen={selected !== null}
        title="Patient Information"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <PatientCardComponent
            key={selected.id}
            patient={selected}
            onUpdated={handleUpdated}
          />
        )}
      </ModalComponent>
      {lastUpdated && (
        // Fixed to the corner, so it's seen wherever the list is scrolled.
        <div className="fixed right-4 bottom-4 z-10 w-full max-w-sm">
          <AlertComponent
            type="success"
            title="Update successful!"
            text={`${lastUpdated} has been updated successfully.`}
            autoDismissMs={3000}
            onDismiss={() => setLastUpdated(null)}
          />
        </div>
      )}
    </>
  );
}
