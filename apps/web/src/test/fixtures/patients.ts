import type {PatientRow} from '../../features/patients/api/patients-api.ts';
import type {Patient} from '../../features/patients/model/patient.ts';

// Synthetic, obviously fake data only.

export function patientRow(
  id: number,
  overrides: Partial<PatientRow> = {}
): PatientRow {
  const n = String(id).padStart(4, '0');

  return {
    id,
    name: `Test Patient ${n}`,
    dob: '01/01/1970',
    gms: `TEST${n}`,
    gender: null,
    address: `${id} Example Street`,
    home_phone: null,
    mobile_phone: null,
    email: null,
    regdate: null,
    type: null,
    hcp: null,
    expdate: null,
    asthma: 0,
    dm: 1,
    cvd: null,
    copd: 0,
    cdm_condition_count: 1,
    potential_income: 150,
    accepted: 0,
    refused: 0,
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

export function patient(id: number, overrides: Partial<Patient> = {}): Patient {
  const n = String(id).padStart(4, '0');

  return {
    id,
    name: `Test Patient ${n}`,
    dob: '01/01/1970',
    gms: `TEST${n}`,
    gender: null,
    address: `${id} Example Street`,
    home_phone: null,
    mobile_phone: null,
    email: null,
    regdate: null,
    type: null,
    hcp: null,
    expdate: null,
    asthma: false,
    dm: true,
    cvd: false,
    copd: false,
    cdm_condition_count: 1,
    potential_income: 150,
    status: 'pending',
    ...overrides,
  };
}
