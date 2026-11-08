import {useId} from 'react';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import type {StatusFilter} from '../model/patient.ts';

const FILTERS: readonly {value: StatusFilter; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'accepted', label: 'Accepted patients'},
  {value: 'refused', label: 'Refused patients'},
  {value: 'pending', label: 'Pending patients'},
];

interface StatusFilterProps {
  filterSelected: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

/** A group of toggle buttons; the selected one is pressed (`aria-pressed`). */
export function StatusFilterComponent({
  filterSelected,
  onFilterChange,
}: StatusFilterProps) {
  const labelId = useId();

  return (
    <CardComponent className="flex w-full flex-1 flex-col flex-wrap gap-4 xl:w-auto">
      <span id={labelId} className="text-center xl:text-left">
        Filters:
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="flex flex-wrap justify-center gap-2 xl:justify-start"
      >
        {FILTERS.map(({value, label}) => (
          <ButtonComponent
            key={value}
            variant="segment"
            aria-pressed={filterSelected === value}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </ButtonComponent>
        ))}
      </div>
    </CardComponent>
  );
}
