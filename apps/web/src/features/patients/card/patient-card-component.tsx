import type {Patient} from '../model/patient.ts';
import {ConditionsSummaryComponent} from './conditions-summary-component.tsx';
import {PatientDetailsComponent} from './patient-details-component.tsx';
import {PatientStatusFormComponent} from './patient-status-form-component.tsx';

interface PatientCardProps {
  patient: Patient;
  /** The id for the heading, so a dialog can be named after it. */
  headingId?: string;
  /** Called with the saved patient, once the lists have refreshed. */
  onUpdated?: (patient: Patient) => void;
}

/** A patient's details and conditions, and the form to accept or refuse. */
export function PatientCardComponent({
  patient,
  headingId,
  onUpdated,
}: PatientCardProps) {
  return (
    <article className="flex flex-col gap-6">
      <header className="border-b border-gray-200 pb-4">
        <h2 id={headingId} className="text-2xl">
          Patient Information
        </h2>
      </header>
      <PatientDetailsComponent patient={patient} />
      <ConditionsSummaryComponent patient={patient} />
      <PatientStatusFormComponent patient={patient} onUpdated={onUpdated} />
    </article>
  );
}
