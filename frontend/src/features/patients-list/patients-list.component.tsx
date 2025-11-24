import { useState } from 'react';
import { ModalComponent } from '../ui/modal.component.tsx';
import { PatientCardComponent } from '../patient-card/patient-card.component.tsx';
import type { Patient } from '../../utils/types/patient.ts';
import { booleanColumns } from '../../utils/booleanColumns.ts';

interface PatientsListProps {
  allPatients: Patient[];
  patients: Patient[];
}

export function PatientsListComponent({
  allPatients,
  patients,
}: PatientsListProps) {
  const [patientsState, setPatientsState] = useState<Patient[]>(allPatients);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  const handleRowClick = (gmsNumber: string) => {
    const index = allPatients.findIndex((p) => p['gms number'] === gmsNumber);
    setSelectedPatient(index >= 0 ? index : null);
  };

  const handlePrev = () => {
    setSelectedPatient((prev) => (prev && prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setSelectedPatient((prev) =>
      prev !== null && prev < allPatients.length - 1 ? prev + 1 : prev
    );
  };

  const handleCalledChange = (index: number, value: boolean) => {
    setPatientsState((prev) =>
      prev.map((p, i) => (i === index ? { ...p, called: value ? '1' : '0' } : p))
    );
  };

  const handleAcceptedChange = (index: number, value: boolean) => {
    setPatientsState((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, accepted: value ? '1' : '0' } : p
      )
    );
  };

  return (
    <div className="overflow-hidden overflow-x-auto rounded-xl shadow-md">
      <table className="relative w-full min-w-100 table-auto md:table-fixed">
        <thead className="bg-sky-200">
          <tr>
            {allPatients[0] &&
              Object.keys(allPatients[0]).map((header) => {
                const [firstLetter, ...word] = header;

                header = firstLetter.toUpperCase() + word.join('');

                return (
                  <th
                    key={header}
                    scope="col"
                    className="text-md px-3 py-3.5 text-left font-semibold"
                  >
                    {header}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody className="bg-white">
          {patients.map((patient) => {
            let rowBackground = '';

            if (patient.called === '1' && patient.accepted === '1') {
              rowBackground = 'bg-green-100';
            } else if (patient.called === '1' && patient.accepted === '0') {
              rowBackground = 'bg-red-100';
            }

            return (
              <tr
                key={patient['gms number']}
                className={`transition duration-200 ease-in-out not-last:border-b not-last:border-gray-200 hover:cursor-pointer hover:bg-sky-100 ${rowBackground}`}
                onClick={() => handleRowClick(patient['gms number'])}
              >
                {Object.keys(patient).map((header) => {
                  const value = patient[header as keyof Patient];

                  if (booleanColumns.includes(header)) {
                    return (
                      <td key={header} className="px-3 py-3.5 text-left">
                        {value === '1' ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-red-400"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 12h2" />
                            <path d="M17 12h2" />
                            <path d="M11 12h2" />
                          </svg>
                        )}
                      </td>
                    );
                  }

                  if (header === 'called' || header === 'accepted') {
                    return (
                      <td key={header} className="px-3 py-3.5 text-left">
                        {value === '1' ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-green-400"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-red-400"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                          </svg>
                        )}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={header}
                      className="px-3 py-3.5 text-left break-all"
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <ModalComponent
        isOpen={selectedPatient !== null}
        onClose={() => setSelectedPatient(null)}
      >
        {selectedPatient !== null && (
          <div>
            <div className="mb-2 text-center font-medium text-gray-700">
              Patient {selectedPatient + 1} of {allPatients.length}
            </div>
            <div className="flex justify-center gap-4 py-4">
              <button
                type="button"
                className="rounded-xl bg-sky-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:not-disabled:-translate-y-1 hover:not-disabled:scale-110 hover:not-disabled:bg-sky-700 disabled:bg-gray-200"
                disabled={selectedPatient === 0}
                onClick={handlePrev}
              >
                Previous patient
              </button>
              <button
                type="button"
                className="rounded-xl bg-sky-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:not-disabled:-translate-y-1 hover:not-disabled:scale-110 hover:not-disabled:bg-sky-700 disabled:bg-gray-200"
                disabled={selectedPatient === allPatients.length - 1}
                onClick={handleNext}
              >
                Next patient
              </button>
            </div>
            <PatientCardComponent
              patient={patientsState[selectedPatient]}
              index={selectedPatient}
              onCalledChange={handleCalledChange}
              onAcceptedChange={handleAcceptedChange}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
