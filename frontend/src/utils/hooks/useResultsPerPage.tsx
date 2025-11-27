import {useState} from 'react';

export function useResultsPerPage() {
  const [patientsPerPage, setPatientsPerPage] = useState(10);

  const handleResultsPerPage = (results: number) => {
    setPatientsPerPage(results);
  };

  return {
    resultsPerPage: patientsPerPage,
    handleResultsPerPage,
  };
}
