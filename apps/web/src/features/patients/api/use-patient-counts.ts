import {useQuery} from '@tanstack/react-query';
import {patientKeys} from './patient-keys.ts';
import {fetchPatientCounts} from './patients-api.ts';

/** The practice's totals by status, unaffected by search or filters. */
export function usePatientCounts() {
  return useQuery({
    queryKey: patientKeys.counts(),
    queryFn: ({signal}) => fetchPatientCounts(signal),
  });
}
