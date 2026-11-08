import type {FormEvent} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {SwitchComponent} from '@cdm-optimiser/ui/components/switch-component.tsx';
import {getErrorMessage} from '../../../lib/get-error-message.ts';
import type {Patient} from '../model/patient.ts';
import {usePatientStatusForm} from './use-patient-status-form.ts';

interface PatientStatusFormProps {
  patient: Patient;
  /** Called with the saved patient, once the lists have refreshed. */
  onUpdated?: (patient: Patient) => void;
}

export function PatientStatusFormComponent({
  patient,
  onUpdated,
}: PatientStatusFormProps) {
  const form = usePatientStatusForm(patient, onUpdated);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void form.submit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border-t border-gray-200 pt-4"
    >
      <div className="flex flex-wrap items-center gap-6">
        <SwitchComponent
          label="Accepted"
          tone="positive"
          checked={form.status === 'accepted'}
          onChange={(event) => form.setAccepted(event.target.checked)}
        />
        <SwitchComponent
          label="Refused"
          tone="negative"
          checked={form.status === 'refused'}
          onChange={(event) => form.setRefused(event.target.checked)}
        />
        <ButtonComponent type="submit" disabled={form.isPending}>
          {form.isPending ? 'Updating patient…' : 'Update patient'}
        </ButtonComponent>
      </div>
      {form.error && (
        <AlertComponent
          type="error"
          title="Error updating the patient"
          text={getErrorMessage(form.error)}
        />
      )}
    </form>
  );
}
