import type {Patient, PatientStatus} from '../model/patient.ts';
import {PATIENT_COLUMNS} from '../model/patient-columns.ts';
import {PatientCellComponent} from './patient-cell-component.tsx';

/**
 * Accepted rows are green, refused rows red; pending rows have no colour.
 * Dark mode uses dark fills, so every row keeps the same light text. The
 * colour only helps: the Status cell says the same in words and a shape.
 */
const ROW_COLOUR: Record<PatientStatus, string> = {
  accepted: 'bg-green-100 dark:bg-emerald-900',
  refused: 'bg-red-100 dark:bg-rose-900',
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
      className={`transition duration-200 ease-in-out hover:cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-900 ${ROW_COLOUR[patient.status]}`}
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
