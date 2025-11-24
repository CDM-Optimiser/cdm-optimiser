import {useState} from 'react';
import {PatientCardComponent} from '../features/patient-card/patient-card.component.tsx';
import {useListPatients} from '../utils/hooks/useListPatients.tsx';

export function PatientsCardPageComponent() {
  const {patients} = useListPatients();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev < patients.length - 1 ? prev + 1 : prev));

  if (!patients || patients.length === 0) {
    return <div className="py-20 text-center">No patients available</div>;
  }

  const currentPatient = patients[currentIndex];

  return (
    <section className="mx-auto max-w-7xl p-6">
      <div className="mb-4 flex items-center justify-between rounded-xl bg-white p-4">
        <span className="font-medium text-gray-700">
          Patient {currentIndex + 1} of {patients.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="rounded-xl bg-sky-500 px-4 py-2 text-white transition hover:not-disabled:bg-sky-700 disabled:bg-gray-200"
          >
            Previous patient
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === patients.length - 1}
            className="rounded-xl bg-sky-500 px-4 py-2 text-white transition hover:not-disabled:bg-sky-700 disabled:bg-gray-200"
          >
            Next patient
          </button>
        </div>
      </div>
      <section className="rounded-xl bg-white p-4">
        <PatientCardComponent patient={currentPatient} index={currentIndex} />
      </section>
    </section>
  );
}
