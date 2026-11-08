import type {ChangeEvent} from 'react';

interface PageSizeSelectProps {
  selectIDAndName: string;
  resultsPerPage: number;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function PageSizeSelectComponent({
  selectIDAndName,
  resultsPerPage,
  onChange = () => {},
}: PageSizeSelectProps) {
  return (
    <>
      <label htmlFor={selectIDAndName}>Patients per page:</label>
      <select
        id={selectIDAndName}
        name={selectIDAndName}
        value={resultsPerPage}
        className="rounded-md bg-white px-2 py-1 shadow-md outline-1 outline-gray-500 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-gray-800 dark:outline-gray-500 dark:focus-visible:outline-sky-400"
        onChange={onChange}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </>
  );
}
