import {useState} from 'react';
import {PatientCardComponent} from '../patient-card/patient-card.component.tsx';
import {ModalComponent} from '../ui/modal.component.tsx';
import {SVGComponent} from '../ui/svg.component.tsx';
import type {Patient} from '../../utils/types/patient.ts';
import {
  booleanColumns,
  headerLabels,
  excludedColumns,
} from '../../utils/patientsTableColumns.ts';
import {useSelectedPatient} from '../../utils/hooks/useSelectedPatient.tsx';

interface PatientsListProps {
  allPatients: Patient[];
  patients: Patient[];
}

export function PatientsListComponent({
  allPatients,
  patients,
}: PatientsListProps) {
  const [patientsState, setPatientsState] = useState<Patient[]>(allPatients);

  const {selectedPatient, setSelectedPatient, handleRowClick} =
    useSelectedPatient(allPatients);

  const handlePrev = () => {
    setSelectedPatient((prev) => (prev && prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setSelectedPatient((prev) =>
      prev !== null && prev < allPatients.length - 1 ? prev + 1 : prev
    );
  };

  const handleAcceptedChange = (index: number, value: boolean) => {
    setPatientsState((prev) =>
      prev.map((patient, i) =>
        i === index ? {...patient, accepted: value ? true : false} : patient
      )
    );
  };

  const handleRefuseChange = (index: number, value: boolean) => {
    setPatientsState((prev) =>
      prev.map((patient, i) =>
        i === index ? {...patient, refused: value ? true : false} : patient
      )
    );
  };

  return (
    <div className="overflow-hidden overflow-x-auto rounded-xl shadow-md dark:ring-1 dark:ring-gray-600">
      <table className="relative w-full min-w-100 table-auto">
        <thead className="bg-sky-200 dark:bg-white/5">
          <tr>
            {Object.entries(headerLabels)
              .filter(([key]) => !excludedColumns.includes(key))
              .map(([key, label]) => (
                <th
                  key={key}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  {label}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-white/5">
          {patients.map((patient) => {
            let rowBackground = '';

            if (patient.accepted && !patient.refused) {
              rowBackground =
                'bg-green-100 dark:bg-emerald-300 dark:text-gray-900';
            } else if (patient.refused && !patient.accepted) {
              rowBackground = 'bg-red-100 dark:bg-rose-300 dark:text-gray-900';
            }

            return (
              <tr
                key={patient.gms}
                className={`transition duration-200 ease-in-out not-last:border-b not-last:border-gray-200 hover:cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-500 ${rowBackground}`}
                onClick={() => handleRowClick(patient.gms)}
              >
                {Object.keys(headerLabels)
                  .filter((key) => !excludedColumns.includes(key))
                  .map((key) => {
                    const typedKey = key as keyof Patient;

                    let displayValue: boolean | string | number =
                      patient[typedKey] ?? '';

                    if (booleanColumns.includes(key)) {
                      return (
                        <td
                          key={key}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          {displayValue ? (
                            <SVGComponent className="text-green-400">
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                            </SVGComponent>
                          ) : (
                            <SVGComponent className="text-gray-40">
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M5 12h2" />
                              <path d="M17 12h2" />
                              <path d="M11 12h2" />
                            </SVGComponent>
                          )}
                        </td>
                      );
                    }
                    if (key === 'potential_income') {
                      displayValue = `€ ${patient[typedKey]}`;
                    }

                    return (
                      <td
                        key={key}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {displayValue}
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
              onAcceptedChange={handleAcceptedChange}
              onRefusedChange={handleRefuseChange}
            />
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
