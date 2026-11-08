import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import type {StatusFilter} from '../model/patient.ts';
import {STATUS_FILTERS} from '../model/status-filters.ts';

interface StatusFilterButtonsProps {
  selected: StatusFilter;
  onChoose: (filter: StatusFilter) => void;
  /** A row on the filters card, or a column in the filters drawer. */
  orientation?: 'horizontal' | 'vertical';
  /** Names the group: the id of a visible label, or the label itself. */
  'aria-labelledby'?: string;
  'aria-label'?: string;
}

/**
 * A group of toggle buttons, one per filter. The selected one is pressed
 * (`aria-pressed`) and filled in the primary colour; the others are
 * secondary.
 */
export function StatusFilterButtonsComponent({
  selected,
  onChoose,
  orientation = 'horizontal',
  ...label
}: StatusFilterButtonsProps) {
  return (
    <div
      role="group"
      {...label}
      className={
        orientation === 'horizontal'
          ? 'flex flex-wrap justify-center gap-2 xl:justify-start'
          : 'flex flex-col gap-3'
      }
    >
      {STATUS_FILTERS.map(({value, label: text}) => (
        <ButtonComponent
          key={value}
          variant={selected === value ? 'primary' : 'secondary'}
          aria-pressed={selected === value}
          className={orientation === 'vertical' ? 'w-full text-left' : ''}
          onClick={() => onChoose(value)}
        >
          {text}
        </ButtonComponent>
      ))}
    </div>
  );
}
