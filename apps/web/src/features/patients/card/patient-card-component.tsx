import type {Patient} from '../model/patient.ts';
import {ConditionsSummaryComponent} from './conditions-summary-component.tsx';
import {PatientDetailsComponent} from './patient-details-component.tsx';
import {PatientStatusFormComponent} from './patient-status-form-component.tsx';

interface PatientCardProps {
  patient: Patient;
  /** Called with the saved patient, once the lists have refreshed. */
  onUpdated?: (patient: Patient) => void;
}

/**
 * A patient's details and conditions, and the form to accept or refuse.
 * The container gives it its title: the dialog on the list page, the card
 * on the pending page.
 */
export function PatientCardComponent({patient, onUpdated}: PatientCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <PatientDetailsComponent patient={patient} />
      <ConditionsSummaryComponent patient={patient} />
      <PatientStatusFormComponent patient={patient} onUpdated={onUpdated} />
    </div>
  );
}
