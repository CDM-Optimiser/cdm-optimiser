import type {ChangeEvent} from 'react';
import {SearchIcon} from '@cdm-optimiser/ui/icons/search-icon.tsx';

interface SearchPatientProps {
  inputSearchID: string;
  placeholder?: string;
  value: string;
  onTextChange?: (text: string) => void;
}

export function SearchPatientComponent({
  inputSearchID,
  placeholder,
  value,
  onTextChange = () => {},
}: SearchPatientProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onTextChange(event.target.value);
  };

  return (
    <section className="patient-finder grid w-full grid-cols-1">
      <label htmlFor={inputSearchID} className="sr-only">
        Search patient
      </label>
      <input
        type="search"
        id={inputSearchID}
        name={inputSearchID}
        placeholder={placeholder}
        value={value}
        className="col-start-1 row-start-1 block w-full rounded-xl bg-white px-3 py-5 pr-3 pl-10 shadow-md outline-1 outline-offset-1 outline-gray-200 transition duration-200 ease-in-out focus:outline-4 focus:outline-offset-1 focus:outline-sky-500 dark:bg-white/5 dark:text-gray-400 dark:outline-gray-600"
        onChange={handleInputChange}
      />
      <SearchIcon className="pointer-events-none col-start-1 row-start-1 ml-2 self-center text-gray-400" />
    </section>
  );
}
