import type {Patient} from './types/patient.ts';

export function filterPatients(
  resultsPerPage: number,
  searchText: string,
  patients: Patient[],
  currentPage: number,
  acceptedFilter: 'all' | 'accepted' | 'refused' = 'all'
) {
  let filteredPatients = patients;

  if (searchText) {
    filteredPatients = filteredPatients.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.dob.includes(searchText) ||
        patient['gms number'].toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }

  if (acceptedFilter === 'accepted') {
    filteredPatients = filteredPatients.filter(
      (patient) => patient.accepted === '1' && patient.refused === '0'
    );
  } else if (acceptedFilter === 'refused') {
    filteredPatients = filteredPatients.filter(
      (patient) => patient.refused === '1' && patient.accepted === '0'
    );
  }

  const totalPages = Math.ceil(filteredPatients.length / resultsPerPage);

  const pageResults = filteredPatients.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return {
    totalPages,
    pageResults,
  };
}
