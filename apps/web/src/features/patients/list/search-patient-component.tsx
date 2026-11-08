import type {ChangeEvent} from 'react';
import {TextFieldComponent} from '@cdm-optimiser/ui/components/text-field-component.tsx';
import {SearchIcon} from '@cdm-optimiser/ui/icons/search-icon.tsx';

interface SearchPatientProps {
  inputSearchID: string;
  placeholder?: string;
  value: string;
  onTextChange?: (text: string) => void;
}

/** The patients search box: the shared text field, with a search icon. */
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
    <TextFieldComponent
      label="Search patients"
      hideLabel
      icon={<SearchIcon />}
      type="search"
      id={inputSearchID}
      name={inputSearchID}
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
      className="w-full"
    />
  );
}
