import {useState} from 'react';

export function usePageChange() {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return {
    currentPage,
    handlePageChange,
  };
}
