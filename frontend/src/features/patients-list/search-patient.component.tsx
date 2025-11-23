import type {ChangeEvent} from 'react';

interface SearchPatientProps {
  inputSearchID: string;
  placeholder?: string;
  onTextChange?: (text: string) => void;
}

export function SearchPatientComponent({
  inputSearchID,
  placeholder,
  onTextChange = () => {},
}: SearchPatientProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;

    onTextChange(inputText);
  };

  return (
    <section className="patient-finder grid w-full grid-cols-1 pb-6">
      <label htmlFor={inputSearchID} className="sr-only">
        Search patient
      </label>
      <input
        type="search"
        id={inputSearchID}
        name={inputSearchID}
        placeholder={placeholder}
        className="col-start-1 row-start-1 block w-full rounded-full bg-white px-3 py-3 pr-3 pl-10 shadow-md outline-1 outline-offset-1 outline-gray-200 transition duration-200 ease-in-out focus:outline-2 focus:outline-offset-2 focus:outline-sky-500"
        onChange={handleInputChange}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="col-start-1 row-start-1 ml-2 self-center text-gray-400"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
      </svg>
    </section>
  );
}
