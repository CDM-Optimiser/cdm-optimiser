import type {Patient} from './types/patient.ts';

export type PatientFilter = 'all' | 'accepted' | 'refused' | 'pending';

export function filterPatients(
  patients: Patient[],
  acceptedFilter: PatientFilter = 'all'
) {
  const filteredPatients = patients.filter((patient) => {
    switch (acceptedFilter) {
      case 'accepted':
        return patient.accepted && !patient.refused;
      case 'refused':
        return patient.refused && !patient.accepted;
      case 'pending':
        return !patient.accepted && !patient.refused;
      default:
        return true;
    }
  });

  return {filteredPatients};
}
