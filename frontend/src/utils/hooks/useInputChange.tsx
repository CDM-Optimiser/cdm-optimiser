import {useCallback, useState} from 'react';

export function useInputChange() {
  const [searchText, setSearchText] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('text') || '';
  });

  const handleInputChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  return {
    searchText,
    handleInputChange,
  };
}
