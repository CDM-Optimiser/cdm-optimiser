import {useId, useState} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import {usePatientsPage} from '../features/patients/api/use-patients-page.ts';
import {PatientCardComponent} from '../features/patients/card/patient-card-component.tsx';
import type {Patient} from '../features/patients/model/patient.ts';
import {PendingNavigatorComponent} from '../features/patients/pending/pending-navigator-component.tsx';
import {getErrorMessage} from '../lib/get-error-message.ts';

/**
 * Goes through pending patients one at a time. Each is page `index + 1` of
 * the pending list with one patient per page, so a saved patient leaves the
 * list and the next one takes its place at the same position.
 */
export function PendingPatientsPageComponent() {
  const titleId = useId();
  const [index, setIndex] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const pending = usePatientsPage({
    search: '',
    status: 'pending',
    page: index + 1,
    pageSize: 1,
  });

  const total = pending.data?.total ?? 0;
  const patient = pending.data?.patients[0];

  // Saving the last patient in the list moves back one. Adjusting state
  // while rendering is React's pattern for this.
  if (
    pending.data &&
    !pending.isPlaceholderData &&
    total > 0 &&
    index >= total
  ) {
    setIndex(total - 1);
  }

  const handleUpdated = (updated: Patient) => setLastUpdated(updated.name);

  return (
    <>
      <h1 className="text-2xl font-semibold">Pending patients</h1>
      {lastUpdated && (
        <AlertComponent
          type="success"
          title="Update successful!"
          text={`${lastUpdated} has been updated successfully.`}
          autoDismissMs={3000}
          onDismiss={() => setLastUpdated(null)}
        />
      )}
      {pending.isError ? (
        <AlertComponent
          type="error"
          title="Error getting patients"
          text={getErrorMessage(pending.error)}
        />
      ) : pending.isPending ? (
        <AlertComponent title="Loading patients" text="Loading patients…" />
      ) : total === 0 || !patient ? (
        <AlertComponent
          type="info"
          title="No pending patients"
          text="There are no pending patients to show."
        />
      ) : (
        <>
          <PendingNavigatorComponent
            index={index}
            total={total}
            onPrevious={() => setIndex(index - 1)}
            onNext={() => setIndex(index + 1)}
          />
          <CardComponent
            as="section"
            aria-labelledby={titleId}
            className="flex flex-col gap-6"
          >
            {/* Styled like the dialog's title on the list page. */}
            <h2
              id={titleId}
              className="border-b border-gray-200 pb-4 text-2xl dark:border-gray-600"
            >
              Patient Information
            </h2>
            <PatientCardComponent
              key={patient.id}
              patient={patient}
              onUpdated={handleUpdated}
            />
          </CardComponent>
        </>
      )}
    </>
  );
}
