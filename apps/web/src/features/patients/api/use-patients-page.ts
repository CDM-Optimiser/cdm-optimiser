import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {patientKeys} from './patient-keys.ts';
import {fetchPatientsPage, type PatientsPageParams} from './patients-api.ts';

/**
 * One page of patients. While the next page loads, the previous one stays
 * on screen (`isPlaceholderData` is true), and a request that is no longer
 * needed is cancelled.
 */
export function usePatientsPage(params: PatientsPageParams) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: ({signal}) => fetchPatientsPage(params, signal),
    placeholderData: keepPreviousData,
  });
}
