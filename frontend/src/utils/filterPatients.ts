import type {Patient} from './types/patient.ts';

export function filterPatients(
  patients: Patient[],
  acceptedFilter: 'all' | 'accepted' | 'refused' | 'pending' = 'all'
) {
  let filteredPatients = patients;

  if (acceptedFilter === 'accepted') {
    filteredPatients = filteredPatients.filter(
      (patient) => patient.accepted && !patient.refused
    );
  } else if (acceptedFilter === 'refused') {
    filteredPatients = filteredPatients.filter(
      (patient) => patient.refused && !patient.accepted
    );
  }

  return {
    filteredPatients,
  };
}
