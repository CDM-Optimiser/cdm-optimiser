import type {Patient} from './patient.ts';
import {CONDITIONS, type ConditionKey} from './patient-conditions.ts';

type TextKey = keyof Pick<
  Patient,
  'name' | 'dob' | 'address' | 'home_phone' | 'mobile_phone'
>;

/** A column of the patients table. `kind` decides how a cell is drawn. */
export type PatientColumn =
  | {kind: 'text'; key: TextKey; label: string}
  | {kind: 'status'; key: 'status'; label: string}
  | {kind: 'condition'; key: ConditionKey; label: string};

/** The table's columns, in order. Add a column by adding an entry. */
export const PATIENT_COLUMNS: readonly PatientColumn[] = [
  {kind: 'text', key: 'name', label: 'Name'},
  // The row colour shows the status too, but not to everyone: this column
  // is what screen readers and colour-blind users go by.
  {kind: 'status', key: 'status', label: 'Status'},
  {kind: 'text', key: 'dob', label: 'D.O.B.'},
  {kind: 'text', key: 'address', label: 'Address'},
  {kind: 'text', key: 'home_phone', label: 'Home Phone'},
  {kind: 'text', key: 'mobile_phone', label: 'Mobile Phone'},
  ...CONDITIONS.map(({key, label}): PatientColumn => ({
    kind: 'condition',
    key,
    label,
  })),
];
