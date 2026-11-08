import {useId, useState} from 'react';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import {ModalComponent} from '@cdm-optimiser/ui/components/modal-component.tsx';
import {FilterIcon} from '@cdm-optimiser/ui/icons/filter-icon.tsx';
import {useCloseOnWideScreen} from '../../../hooks/use-close-on-wide-screen.ts';
import type {StatusFilter} from '../model/patient.ts';
import {STATUS_FILTERS} from '../model/status-filters.ts';
import {StatusFilterButtonsComponent} from './status-filter-buttons-component.tsx';

interface StatusFilterProps {
  filterSelected: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

/**
 * The patient list's filters. On wide screens they sit on a card; on small
 * screens a "Filters" button, naming the current filter, opens them in a
 * drawer, which closes once one is chosen.
 */
export function StatusFilterComponent({
  filterSelected,
  onFilterChange,
}: StatusFilterProps) {
  const labelId = useId();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);

  useCloseOnWideScreen(isDrawerOpen, closeDrawer, 'md');

  const selectedLabel = STATUS_FILTERS.find(
    ({value}) => value === filterSelected
  )?.label;

  return (
    <>
      <CardComponent className="hidden w-full flex-1 flex-col flex-wrap justify-center gap-4 md:flex xl:w-auto">
        <span id={labelId} className="text-center xl:text-left">
          Filters:
        </span>
        <StatusFilterButtonsComponent
          aria-labelledby={labelId}
          selected={filterSelected}
          onChoose={onFilterChange}
        />
      </CardComponent>

      <ButtonComponent
        variant="secondary"
        className="flex w-full items-center justify-center gap-2 md:hidden"
        aria-haspopup="dialog"
        onClick={() => setIsDrawerOpen(true)}
      >
        <FilterIcon />
        Filters: {selectedLabel}
      </ButtonComponent>

      <ModalComponent
        isOpen={isDrawerOpen}
        placement="end"
        title="Filters"
        onClose={closeDrawer}
      >
        <StatusFilterButtonsComponent
          orientation="vertical"
          aria-label="Filter patients by status"
          selected={filterSelected}
          onChoose={(filter) => {
            onFilterChange(filter);
            closeDrawer();
          }}
        />
      </ModalComponent>
    </>
  );
}
