import {CircleCheckFilledIcon} from '@cdm-optimiser/ui/icons/circle-check-filled-icon.tsx';
import {DotsIcon} from '@cdm-optimiser/ui/icons/dots-icon.tsx';
import type {Patient} from '../model/patient.ts';
import {CONDITIONS} from '../model/patient-conditions.ts';

/** Which CDM conditions the patient has: a tick for yes, dots for no. */
export function ConditionsSummaryComponent({patient}: {patient: Patient}) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-4">
      {CONDITIONS.map(({key, label}) => (
        <li key={key} className="flex items-center gap-2">
          <strong>{label}:</strong>
          {patient[key] ? (
            <CircleCheckFilledIcon className="text-green-700 dark:text-green-400" />
          ) : (
            <DotsIcon className="text-gray-500 dark:text-gray-400" />
          )}
          <span className="sr-only">{patient[key] ? 'Yes' : 'No'}</span>
        </li>
      ))}
    </ul>
  );
}
