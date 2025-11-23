import {useState} from 'react';

export function useInputChange() {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (text: string) => {
    setSearchText(text);
  };

  return {
    searchText,
    handleInputChange,
  };
}
