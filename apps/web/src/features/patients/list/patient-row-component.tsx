import type {Patient, PatientStatus} from '../model/patient.ts';
import {PATIENT_COLUMNS} from '../model/patient-columns.ts';
import {PatientCellComponent} from './patient-cell-component.tsx';

/** Accepted rows are green, refused rows red; pending rows have no colour. */
const ROW_COLOUR: Record<PatientStatus, string> = {
  accepted: 'bg-green-100 dark:bg-emerald-300 dark:text-gray-900',
  refused: 'bg-red-100 dark:bg-rose-300 dark:text-gray-900',
  pending: '',
};

interface PatientRowProps {
  patient: Patient;
  onOpen: (patient: Patient) => void;
}

export function PatientRowComponent({patient, onOpen}: PatientRowProps) {
  const open = () => onOpen(patient);

  return (
    <tr
      className={`transition duration-200 ease-in-out not-last:border-b not-last:border-gray-200 hover:cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-500 ${ROW_COLOUR[patient.status]}`}
      onClick={open}
    >
      {PATIENT_COLUMNS.map((column) => (
        <PatientCellComponent
          key={column.key}
          patient={patient}
          column={column}
          onOpen={open}
        />
      ))}
    </tr>
  );
}
