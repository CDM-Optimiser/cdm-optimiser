import type {Patient} from './types/patient.ts';

export function filterPatients(
  resultsPerPage: number,
  searchText: string,
  patients: Patient[],
  currentPage: number
) {
  const patientsFoundByText =
    searchText === ''
      ? patients
      : patients.filter((patient) => {
          return (
            patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
            patient.dob.includes(searchText) ||
            patient['gms number']
              .toLowerCase()
              .includes(searchText.toLowerCase())
          );
        });

  const totalPages = Math.ceil(patientsFoundByText.length / resultsPerPage);

  const pageResults = patientsFoundByText.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return {
    totalPages,
    pageResults,
  };
}
