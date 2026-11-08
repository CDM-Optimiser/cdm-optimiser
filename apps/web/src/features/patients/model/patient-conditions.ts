import type {Patient} from './patient.ts';

/** The chronic conditions the CDM programme covers, as `Patient` flags. */
export type ConditionKey = keyof Pick<
  Patient,
  'asthma' | 'dm' | 'cvd' | 'copd'
>;

export interface Condition {
  key: ConditionKey;
  label: string;
}

export const CONDITIONS: readonly Condition[] = [
  {key: 'asthma', label: 'Asthma'},
  {key: 'dm', label: 'DM'},
  {key: 'cvd', label: 'CVD'},
  {key: 'copd', label: 'COPD'},
];
