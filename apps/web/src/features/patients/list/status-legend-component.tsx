import type {ComponentType} from 'react';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import type {IconProps} from '@cdm-optimiser/ui/icons/icon-props.ts';
import {SquareFilledIcon} from '@cdm-optimiser/ui/icons/square-filled-icon.tsx';
import {SquareIcon} from '@cdm-optimiser/ui/icons/square-icon.tsx';
import type {PatientCounts} from '../api/patients-api.ts';
import {STATUS_LABELS, type PatientStatus} from '../model/patient.ts';

/** Each swatch is the exact row colour of its status in the table. */
const ITEMS: readonly {
  status: PatientStatus;
  Icon: ComponentType<IconProps>;
  className: string;
}[] = [
  {
    status: 'accepted',
    Icon: SquareFilledIcon,
    className:
      'stroke-black stroke-2 text-green-100 dark:stroke-white dark:text-emerald-900',
  },
  {
    status: 'refused',
    Icon: SquareFilledIcon,
    className:
      'stroke-black stroke-2 text-red-100 dark:stroke-white dark:text-rose-900',
  },
  {status: 'pending', Icon: SquareIcon, className: ''},
];

interface StatusLegendProps {
  /** The practice's counts; zeros while they load. */
  counts: PatientCounts | undefined;
}

export function StatusLegendComponent({counts}: StatusLegendProps) {
  return (
    <CardComponent className="flex w-full flex-col flex-wrap gap-4 xl:w-auto">
      <div className="flex justify-center gap-2">
        Total patients:{' '}
        <span className="font-medium">{counts?.total ?? 0}</span>
      </div>
      <ul className="flex flex-wrap items-center justify-center gap-6 py-2">
        {ITEMS.map(({status, Icon, className}) => (
          <li key={status} className="flex items-center gap-2">
            <Icon className={className} />
            <span>
              {STATUS_LABELS[status]} ({counts?.[status] ?? 0})
            </span>
          </li>
        ))}
      </ul>
    </CardComponent>
  );
}
