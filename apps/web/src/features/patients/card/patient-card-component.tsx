import {useId, useState, type ChangeEvent, type MouseEvent} from 'react';
import type {Patient, PatientStatus} from '../model/patient.ts';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {SVGComponent} from '@cdm-optimiser/ui/components/svg-component.tsx';
import {getErrorMessage} from '../../../lib/get-error-message.ts';
import {useUpdatePatientStatus} from '../api/use-update-patient-status.ts';

interface PatientCardProps {
  patient: Patient;
  /** Called with the saved patient, once the lists have refreshed. */
  onUpdated?: (patient: Patient) => void;
  /** Show the success message inside the card. */
  showAlert?: boolean;
}

export function PatientCardComponent({
  patient,
  onUpdated,
  showAlert = true,
}: PatientCardProps) {
  const acceptedInputID = useId();
  const refusedInputID = useId();
  // One value, so "accepted" and "refused" can never both be on.
  const [status, setStatus] = useState<PatientStatus>(patient.status);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<
    string | null
  >(null);

  const updateStatus = useUpdatePatientStatus();

  const handleAcceptedToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.checked ? 'accepted' : 'pending');
  };

  const handleRefusedToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.checked ? 'refused' : 'pending');
  };

  const handleUpdate = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setUpdateSuccessMessage(null);

    // mutateAsync, not mutate: on the pending page this card unmounts as soon
    // as the saved patient leaves the list, and `mutate` callbacks don't run
    // after unmount.
    let updated: Patient;

    try {
      updated = await updateStatus.mutateAsync({id: patient.id, status});
    } catch {
      return; // shown from updateStatus.error below
    }

    onUpdated?.(updated);

    if (showAlert) {
      setUpdateSuccessMessage(`Patient ${updated.name} updated successfully!`);
    }
  };

  return (
    <section className="mx-auto max-w-7xl">
      <article className="flex flex-col gap-6">
        <header className="border-b border-gray-200">
          <div className="flex flex-wrap items-center pb-4">
            <h1 className="text-2xl">Patient Information</h1>
          </div>
        </header>
        <section className="grid grid-cols-2 gap-6">
          <div className="col-span-2 flex flex-col gap-2">
            <strong>Name</strong>
            <span>{patient.name}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong>D.O.B.</strong>
            <span>{patient.dob}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong>Address</strong>
            <span>{patient.address}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong>Home Phone</strong>
            <span>{patient.home_phone}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong>Mobile Phone</strong>
            <span>{patient.mobile_phone}</span>
          </div>
          <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
            <strong>Asthma:</strong>
            {patient.asthma ? (
              <SVGComponent className="text-green-400">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
              </SVGComponent>
            ) : (
              <SVGComponent className="text-gray-40">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12h2" />
                <path d="M17 12h2" />
                <path d="M11 12h2" />
              </SVGComponent>
            )}
            <strong>DM:</strong>
            {patient.dm ? (
              <SVGComponent className="text-green-400">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
              </SVGComponent>
            ) : (
              <SVGComponent className="text-gray-40">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12h2" />
                <path d="M17 12h2" />
                <path d="M11 12h2" />
              </SVGComponent>
            )}
            <strong>CVD:</strong>
            {patient.cvd ? (
              <SVGComponent className="text-green-400">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
              </SVGComponent>
            ) : (
              <SVGComponent className="text-gray-40">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12h2" />
                <path d="M17 12h2" />
                <path d="M11 12h2" />
              </SVGComponent>
            )}
            <strong>COPD:</strong>
            {patient.copd ? (
              <SVGComponent className="text-green-400">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
              </SVGComponent>
            ) : (
              <SVGComponent className="text-gray-40">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12h2" />
                <path d="M17 12h2" />
                <path d="M11 12h2" />
              </SVGComponent>
            )}
          </div>
        </section>
        <div className="flex items-center gap-6 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-md ms-3 font-medium select-none">
                Accepted
              </span>
              <div className="group relative inline-flex h-6 w-12 rounded-xl bg-gray-300 p-0.5 outline-offset-2 transition duration-200 ease-in-out has-checked:bg-green-500 dark:bg-white/5 dark:ring dark:ring-gray-600">
                <span className="relative inline-flex h-5 w-5 rounded-xl bg-white p-2 ring-1 ring-gray-300 transition duration-200 ease-in-out group-has-[input:checked]:translate-x-6 group-has-[input:checked]:ring-green-500 dark:ring-white/5">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex h-full w-full items-center justify-center opacity-100 transition-opacity duration-200 ease-in-out group-has-[input:checked]:opacity-0"
                  >
                    <SVGComponent
                      height="16"
                      width="16"
                      fill="none"
                      strokeWidth="2"
                      className="dark:text-gray-900"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12h2" />
                      <path d="M17 12h2" />
                      <path d="M11 12h2" />
                    </SVGComponent>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex h-full w-full appearance-none items-center justify-center opacity-0 transition-opacity duration-100 ease-in-out group-has-[input:checked]:opacity-100"
                  >
                    <SVGComponent
                      height="16"
                      width="16"
                      fill="none"
                      strokeWidth="2"
                      className="dark:text-gray-900"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12l5 5l10 -10" />
                    </SVGComponent>
                  </span>
                </span>
                <input
                  type="checkbox"
                  id={acceptedInputID}
                  name={acceptedInputID}
                  title="toggle"
                  checked={status === 'accepted'}
                  onChange={handleAcceptedToggle}
                  className="absolute inset-0 cursor-pointer appearance-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-md ms-3 font-medium select-none">
                Refused
              </span>
              <div className="group relative inline-flex h-6 w-12 rounded-xl bg-gray-300 p-0.5 outline-offset-2 transition duration-200 ease-in-out has-checked:bg-red-500 dark:bg-white/5 dark:ring dark:ring-gray-600">
                <span className="relative inline-flex h-5 w-5 rounded-xl bg-white p-2 ring-1 ring-gray-300 transition duration-200 ease-in-out group-has-[input:checked]:translate-x-6 group-has-[input:checked]:ring-red-500">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex h-full w-full items-center justify-center opacity-100 transition-opacity duration-200 ease-in-out group-has-[input:checked]:opacity-0"
                  >
                    <SVGComponent
                      height="16"
                      width="16"
                      fill="none"
                      strokeWidth="2"
                      className="dark:text-gray-900"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12h2" />
                      <path d="M17 12h2" />
                      <path d="M11 12h2" />
                    </SVGComponent>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex h-full w-full appearance-none items-center justify-center opacity-0 transition-opacity duration-100 ease-in-out group-has-[input:checked]:opacity-100"
                  >
                    <SVGComponent
                      height="16"
                      width="16"
                      fill="none"
                      strokeWidth="2"
                      className="dark:text-gray-900"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M18 6l-12 12" />
                      <path d="M6 6l12 12" />
                    </SVGComponent>
                  </span>
                </span>
                <input
                  type="checkbox"
                  id={refusedInputID}
                  name={refusedInputID}
                  title="toggle"
                  checked={status === 'refused'}
                  onChange={handleRefusedToggle}
                  className="absolute inset-0 cursor-pointer appearance-none"
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            title="Update patient"
            onClick={handleUpdate}
            disabled={updateStatus.isPending}
            className="rounded-md border-b-4 border-sky-500 border-b-sky-600 bg-sky-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:text-white hover:not-disabled:border-sky-800 hover:not-disabled:bg-sky-600 active:not-disabled:border-b-0 disabled:cursor-not-allowed dark:border-b-sky-700 dark:bg-sky-500 dark:hover:not-disabled:border-sky-900 dark:hover:not-disabled:bg-sky-800"
          >
            {updateStatus.isPending ? 'Updating patient…' : 'Update patient'}
          </button>
        </div>
        {updateStatus.isError && (
          <AlertComponent
            type="error"
            title="Error updating the patient"
            text={getErrorMessage(updateStatus.error)}
          />
        )}
        {showAlert && updateSuccessMessage && (
          <AlertComponent
            type="success"
            title="Success"
            text={updateSuccessMessage}
            autoDismissMs={3000}
            onDismiss={() => {
              setUpdateSuccessMessage(null);
            }}
          />
        )}
      </article>
    </section>
  );
}
