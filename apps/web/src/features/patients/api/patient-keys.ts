import type {PatientsPageParams} from './patients-api.ts';

/**
 * Query keys for patient data. Everything starts with `patients`, so one
 * invalidation of `patientKeys.all` refreshes lists and counts together.
 */
export const patientKeys = {
  all: ['patients'] as const,
  list: (params: PatientsPageParams) =>
    [...patientKeys.all, 'list', params] as const,
  counts: () => [...patientKeys.all, 'counts'] as const,
};
