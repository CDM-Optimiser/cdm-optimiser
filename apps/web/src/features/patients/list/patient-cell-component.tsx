import {DotsIcon} from '@cdm-optimiser/ui/icons/dots-icon.tsx';
import {SquareCheckFilledIcon} from '@cdm-optimiser/ui/icons/square-check-filled-icon.tsx';
import type {Patient} from '../model/patient.ts';
import type {PatientColumn} from '../model/patient-columns.ts';

interface PatientCellProps {
  patient: Patient;
  column: PatientColumn;
  /** Opens the patient's details; used by the name cell. */
  onOpen: () => void;
}

const CELL = 'border border-gray-300 px-4 py-2';

export function PatientCellComponent({
  patient,
  column,
  onOpen,
}: PatientCellProps) {
  if (column.kind === 'condition') {
    const hasCondition = patient[column.key];

    return (
      <td className={`${CELL} text-center`}>
        {hasCondition ? (
          <SquareCheckFilledIcon className="inline text-green-500" />
        ) : (
          <DotsIcon className="inline text-gray-400" />
        )}
        <span className="sr-only">{hasCondition ? 'Yes' : 'No'}</span>
      </td>
    );
  }

  if (column.key === 'name') {
    // A real button, so keyboard users can open the details too. It stops
    // the click there; the row's own click handler is for mouse users.
    return (
      <td className={CELL}>
        <button
          type="button"
          className="cursor-pointer text-left underline-offset-2 hover:underline"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          {patient.name}
        </button>
      </td>
    );
  }

  return <td className={CELL}>{patient[column.key]}</td>;
}
