import type {Patient} from '../model/patient.ts';
import {PATIENT_COLUMNS} from '../model/patient-columns.ts';
import {PatientRowComponent} from './patient-row-component.tsx';

interface PatientsTableProps {
  patients: Patient[];
  /** Called when a row, or a patient's name, is chosen. */
  onOpen: (patient: Patient) => void;
}

export function PatientsTableComponent({patients, onOpen}: PatientsTableProps) {
  return (
    <div className="overflow-hidden overflow-x-auto rounded-xl shadow-md dark:ring-1 dark:ring-gray-600">
      <table className="w-full min-w-full table-auto">
        <thead className="bg-sky-200 dark:bg-white/5">
          <tr>
            {PATIENT_COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-white/5">
          {patients.map((patient) => (
            <PatientRowComponent
              key={patient.id}
              patient={patient}
              onOpen={onOpen}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
