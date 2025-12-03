import { type Dispatch, type SetStateAction } from 'react';
import { PatientCardComponent } from '../patient-card/patient-card.component.tsx';
import { ModalComponent } from '../ui/modal.component.tsx';
import { SVGComponent } from '../ui/svg.component.tsx';
import type { Patient } from '../../utils/types/patient.ts';
import {
  booleanColumns,
  headerLabels,
  excludedColumns,
} from '../../utils/patientsTableColumns.ts';
import { useSelectedPatient } from '../../utils/hooks/useSelectedPatient.tsx';

interface PatientsListProps {
  patients: Patient[];
  onUpdatePatient: Dispatch<SetStateAction<Patient[]>>;
}

export function PatientsListComponent({
  patients,
  onUpdatePatient,
}: PatientsListProps) {
  const { selectedPatient, setSelectedPatient, handleRowClick } =
    useSelectedPatient();

  return (
    <div className="overflow-hidden overflow-x-auto rounded-xl shadow-md dark:ring-1 dark:ring-gray-600">
      <table className="w-full min-w-full table-auto">
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
            const rowBackground = patient.accepted
              ? 'bg-green-100 dark:bg-emerald-300 dark:text-gray-900'
              : patient.refused
                ? 'bg-red-100 dark:bg-rose-300 dark:text-gray-900'
                : '';

            return (
              <tr
                key={patient.id}
                className={`transition duration-200 ease-in-out not-last:border-b not-last:border-gray-200 hover:cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-500 ${rowBackground}`}
                onClick={() => handleRowClick(patient)}
              >
                {Object.keys(headerLabels)
                  .filter((key) => !excludedColumns.includes(key))
                  .map((key) => {
                    const typedKey = key as keyof Patient;
                    let value: string | number | boolean =
                      patient[typedKey] ?? '';

                    if (booleanColumns.includes(key)) {
                      return (
                        <td
                          key={key}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          {value ? (
                            <SVGComponent className="text-green-500">
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005.195v12.666c0 1.96-1.537 3.56-3.472 3.662l-.195.005h-12.666a3.667 3.667 0 0 1-3.662-3.472l-.005-.195v-12.666c0-1.96 1.537-3.56 3.472-3.662l.195-.005h12.666zm-2.626 7.293a1 1 0 0 0-1.414 0l-3.293 3.292-1.293-1.292-.094-.083a1 1 0 0 0-1.32 1.497l2 2 .094.083a1 1 0 0 0 1.32-.083l4-4.001.083-.094a1 1 0 0 0-.083-1.32z" />
                            </SVGComponent>
                          ) : (
                            <SVGComponent className="text-gray-400">
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M5 12h2" />
                              <path d="M11 12h2" />
                              <path d="M17 12h2" />
                            </SVGComponent>
                          )}
                        </td>
                      );
                    }

                    if (key === 'potential_income')
                      value = `€ ${patient[typedKey]}`;

                    return (
                      <td
                        key={key}
                        className="border border-gray-300 px-4 py-2"
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
        {selectedPatient && (
          <PatientCardComponent
            patient={selectedPatient}
            onUpdatePatient={onUpdatePatient}
            onPendingPatientUpdated={() => { }}
          />
        )}
      </ModalComponent>
    </div>
  );
}
