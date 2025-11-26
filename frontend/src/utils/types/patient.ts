export interface Patient {
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
