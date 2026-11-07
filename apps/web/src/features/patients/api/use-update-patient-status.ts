import {useMutation, useQueryClient} from '@tanstack/react-query';
import {patientKeys} from './patient-keys.ts';
import {updatePatientStatus} from './patients-api.ts';

/**
 * Changes a patient's status, then refetches every patient list and the
 * counts. The mutation stays pending until they have reloaded, so the screen
 * never shows the old status after a save.
 */
export function useUpdatePatientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePatientStatus,
    onSuccess: () => queryClient.invalidateQueries({queryKey: patientKeys.all}),
  });
}
