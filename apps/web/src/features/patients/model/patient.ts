/** Where a patient stands on joining the CDM programme. */
export type PatientStatus = 'accepted' | 'refused' | 'pending';

/** How each status is written in the table and the legend. */
export const STATUS_LABELS: Record<PatientStatus, string> = {
  accepted: 'Accepted',
  refused: 'Refused',
  pending: 'Pending',
};

/** A patient list filter: one status, or every patient. */
export type StatusFilter = PatientStatus | 'all';

/** A patient as the app uses it (see `toPatient` for the database row). */
export interface Patient {
  id: number;
  name: string;
  dob: string;
  gms: string;
  gender: string | null;
  address: string | null;
  home_phone: string | null;
  mobile_phone: string | null;
  email: string | null;
  regdate: string | null;
  type: string | null;
  hcp: string | null;
  expdate: string | null;
  asthma: boolean;
  dm: boolean;
  cvd: boolean;
  copd: boolean;
  cdm_condition_count: number | null;
  potential_income: number | null;
  status: PatientStatus;
}
