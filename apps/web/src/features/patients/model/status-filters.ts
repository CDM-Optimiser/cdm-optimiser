import type {StatusFilter} from './patient.ts';

/** The patient list's filters, in order. Add a filter by adding an entry. */
export const STATUS_FILTERS: readonly {value: StatusFilter; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'accepted', label: 'Accepted patients'},
  {value: 'refused', label: 'Refused patients'},
  {value: 'pending', label: 'Pending patients'},
];
