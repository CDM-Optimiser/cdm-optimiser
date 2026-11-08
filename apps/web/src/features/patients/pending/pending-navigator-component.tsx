import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';

interface PendingNavigatorProps {
  /** 0-based position in the pending list. */
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

/** "Pending patient 2 of 15", with buttons to move through the list. */
export function PendingNavigatorComponent({
  index,
  total,
  onPrevious,
  onNext,
}: PendingNavigatorProps) {
  return (
    <CardComponent className="flex flex-wrap items-center justify-between gap-4">
      <span className="font-medium text-gray-900 dark:text-gray-200">
        Pending patient: {index + 1} of {total}
      </span>
      <div className="flex gap-2">
        <ButtonComponent onClick={onPrevious} disabled={index === 0}>
          Previous patient
        </ButtonComponent>
        <ButtonComponent onClick={onNext} disabled={index >= total - 1}>
          Next patient
        </ButtonComponent>
      </div>
    </CardComponent>
  );
}
