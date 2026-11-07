import type {ChangeEvent} from 'react';

interface PatientsPerPageComponentProps {
  selectIDAndName: string;
  resultsPerPage: number;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function PatientsPerPageComponent({
  selectIDAndName,
  resultsPerPage,
  onChange = () => {},
}: PatientsPerPageComponentProps) {
  return (
    <>
      <label htmlFor={selectIDAndName}>Patients per page:</label>
      <select
        id={selectIDAndName}
        name={selectIDAndName}
        value={resultsPerPage}
        className="rounded-md bg-white px-2 py-1 ring ring-gray-400 dark:bg-white/5"
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
