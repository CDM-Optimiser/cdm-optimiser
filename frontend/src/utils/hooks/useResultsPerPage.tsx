import {useState} from 'react';

export function useResultsPerPage() {
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const handleResultsPerPage = (results: number) => {
    setResultsPerPage(results);
  };

  return {
    resultsPerPage,
    handleResultsPerPage,
  };
}
