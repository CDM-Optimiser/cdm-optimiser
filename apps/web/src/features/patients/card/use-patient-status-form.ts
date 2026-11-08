import {useState} from 'react';
import {useUpdatePatientStatus} from '../api/use-update-patient-status.ts';
import type {Patient, PatientStatus} from '../model/patient.ts';

/**
 * The accept/refuse form for one patient. It keeps a single status, so
 * "accepted" and "refused" can never both be on; switching one off makes
 * the patient pending again.
 */
export function usePatientStatusForm(
  patient: Patient,
  onUpdated?: (patient: Patient) => void
) {
  const [status, setStatus] = useState<PatientStatus>(patient.status);
  const mutation = useUpdatePatientStatus();

  const submit = async () => {
    let updated: Patient;

    // mutateAsync, not mutate: on the pending page the form unmounts as soon
    // as the saved patient leaves the list, and `mutate` callbacks don't run
    // after unmount.
    try {
      updated = await mutation.mutateAsync({id: patient.id, status});
    } catch {
      return; // shown through `error`
    }

    onUpdated?.(updated);
  };

  return {
    status,
    setAccepted: (on: boolean) => setStatus(on ? 'accepted' : 'pending'),
    setRefused: (on: boolean) => setStatus(on ? 'refused' : 'pending'),
    submit,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
