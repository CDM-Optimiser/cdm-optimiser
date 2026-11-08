import type {ComponentType} from 'react';
import {CheckIcon} from '@cdm-optimiser/ui/icons/check-icon.tsx';
import {DotsIcon} from '@cdm-optimiser/ui/icons/dots-icon.tsx';
import type {IconProps} from '@cdm-optimiser/ui/icons/icon-props.ts';
import {SquareCheckFilledIcon} from '@cdm-optimiser/ui/icons/square-check-filled-icon.tsx';
import {XIcon} from '@cdm-optimiser/ui/icons/x-icon.tsx';
import {
  STATUS_LABELS,
  type Patient,
  type PatientStatus,
} from '../model/patient.ts';
import type {PatientColumn} from '../model/patient-columns.ts';

interface PatientCellProps {
  patient: Patient;
  column: PatientColumn;
  /** Opens the patient's details; used by the name cell. */
  onOpen: () => void;
}

const CELL = 'border border-gray-300 px-4 py-2 dark:border-gray-600';

// A shape for each status, as on the Accepted and Refused switches, so the
// status doesn't depend on telling green from red.
const STATUS_ICONS: Record<PatientStatus, ComponentType<IconProps>> = {
  accepted: CheckIcon,
  refused: XIcon,
  pending: DotsIcon,
};

// At least 3:1 on every row colour: white, accepted, refused and hover.
const PRESENT = 'inline text-green-700 dark:text-green-400';
const ABSENT = 'inline text-gray-500 dark:text-gray-400';

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
          <SquareCheckFilledIcon className={PRESENT} />
        ) : (
          <DotsIcon className={ABSENT} />
        )}
        <span className="sr-only">{hasCondition ? 'Yes' : 'No'}</span>
      </td>
    );
  }

  if (column.kind === 'status') {
    const StatusIcon = STATUS_ICONS[patient.status];

    return (
      <td className={CELL}>
        <span className="flex items-center gap-2">
          <StatusIcon className="shrink-0" />
          {STATUS_LABELS[patient.status]}
        </span>
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
