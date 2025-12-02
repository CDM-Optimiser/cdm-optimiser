import {useMemo, useState} from 'react';
import {usePatientsContext} from '../utils/hooks/usePatientsContext.tsx';
import {PatientCardComponent} from '../features/patient-card/patient-card.component.tsx';
import {AlertComponent} from '../features/ui/alert.component.tsx';

export function PendingPatientsPageComponent() {
  const {patients, setPatients} = usePatientsContext();

  const pendingPatients = useMemo(
    () => patients.filter((patient) => !patient.accepted && !patient.refused),
    [patients]
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const safeIndex = Math.min(
    currentIndex,
    Math.max(0, pendingPatients.length - 1)
  );
  const currentPatient = pendingPatients[safeIndex];

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev < pendingPatients.length - 1 ? prev + 1 : prev
    );

  return (
    <section className="mx-auto max-w-7xl p-6">
      {!pendingPatients || pendingPatients.length === 0 ? (
        <AlertComponent
          type="info"
          title="No pending patients"
          text="There are no pending patients to show."
        />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between rounded-xl bg-white p-4 shadow-md dark:bg-white/5 dark:ring dark:ring-gray-600">
            <span className="font-medium text-gray-900 dark:text-gray-200">
              Pending patient: {currentIndex + 1} of {pendingPatients.length}{' '}
              patient/s
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="rounded-md border-b-4 border-b-sky-700 bg-sky-500 px-4 py-2 text-white transition hover:not-disabled:border-b-0 hover:not-disabled:bg-sky-700 disabled:cursor-not-allowed disabled:border-b-gray-500 disabled:bg-gray-200 disabled:text-gray-600"
              >
                Previous patient
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === patients.length - 1}
                className="rounded-md border-b-4 border-b-sky-700 bg-sky-500 px-4 py-2 text-white transition hover:not-disabled:border-b-0 hover:not-disabled:bg-sky-700 disabled:cursor-not-allowed disabled:border-b-gray-500 disabled:bg-gray-200 disabled:text-gray-600"
              >
                Next patient
              </button>
            </div>
          </div>
          <section className="rounded-xl bg-white p-4 shadow-md dark:bg-white/5 dark:ring dark:ring-gray-600">
            <PatientCardComponent
              patient={currentPatient}
              onUpdatePatient={setPatients}
            />
          </section>
        </>
      )}
    </section>
  );
}
