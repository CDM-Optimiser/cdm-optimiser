import type {Patient, StatusFilter} from '../model/patient.ts';

export function filterPatients(
  patients: Patient[],
  acceptedFilter: StatusFilter = 'all'
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
