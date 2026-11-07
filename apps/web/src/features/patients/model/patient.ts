export interface Patient {
  id: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  home_phone: string;
  mobile_phone: string;
  email: string;
  gms: string;
  regdate: string;
  type: string;
  hcp: string;
  expdate: string;
  asthma: boolean;
  dm: boolean;
  cvd: boolean;
  copd: boolean;
  cdm_condition_count: number;
  potential_income: number;
  accepted?: boolean;
  refused?: boolean;
}

/** Where a patient stands on joining the CDM programme. */
export type PatientStatus = 'accepted' | 'refused' | 'pending';

/** A patient list filter: one status, or every patient. */
export type StatusFilter = PatientStatus | 'all';
