import {
  useId,
  useState,
  type ChangeEvent,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from 'react';
import type {Patient} from '../../utils/types/patient.ts';
import {SVGComponent} from '../ui/svg.component.tsx';
import {useUpdatePatient} from '../../api/useUpdatePatient.tsx';
import {AlertComponent} from '../ui/alert.component.tsx';
import {getErrorMessage} from '../../utils/getErrorMessage.ts';

interface PatientCardProps {
  patient: Patient;
  onUpdatePatients: Dispatch<SetStateAction<Patient[]>>;
}

export function PatientCardComponent({
  patient,
  onUpdatePatients,
}: PatientCardProps) {
  const acceptedInputID = useId();
  const refusedInputID = useId();
  const [localAccepted, setLocalAccepted] = useState(!!patient.accepted);
  const [localRefused, setLocalRefused] = useState(!!patient.refused);
  const [localError, setLocalError] = useState<string | null>(null);

  const {updatePatient, updating, error} = useUpdatePatient();

  const handleAcceptedToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    setLocalAccepted(isChecked);
    setLocalRefused(false);
  };

  const handleRefusedToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    setLocalRefused(isChecked);
    setLocalAccepted(false);
  };

  const handleUpdate = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const updated = await updatePatient({
        ...patient,
        accepted: localAccepted,
        refused: localRefused,
      });

      if (updated) {
        onUpdatePatients((prev) =>
          prev.map((p) => (p.gms === updated.gms ? updated : p))
        );
      }
    } catch (error) {
      setLocalError(getErrorMessage(error));
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
              <div className="group relative inline-flex h-6 w-12 rounded-xl bg-gray-300 p-0.5 outline-offset-2 transition duration-200 ease-in-out has-checked:bg-green-500">
                <span className="relative inline-flex h-5 w-5 rounded-xl bg-white p-2 ring-1 ring-gray-300 transition duration-200 ease-in-out group-has-[input:checked]:translate-x-6 group-has-[input:checked]:ring-green-500">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex h-full w-full items-center justify-center opacity-100 transition-opacity duration-200 ease-in-out group-has-[input:checked]:opacity-0"
                  >
                    <SVGComponent
                      height="16"
                      width="16"
                      fill="none"
                      strokeWidth="2"
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
                  checked={localAccepted}
                  onChange={handleAcceptedToggle}
                  className="absolute inset-0 cursor-pointer appearance-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-md ms-3 font-medium select-none">
                Refused
              </span>
              <div className="group relative inline-flex h-6 w-12 rounded-xl bg-gray-300 p-0.5 outline-offset-2 transition duration-200 ease-in-out has-checked:bg-red-500">
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
                  checked={localRefused}
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
            disabled={updating}
            className="rounded-md border-b-4 border-sky-500 border-b-sky-600 bg-sky-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:text-white hover:not-disabled:border-sky-800 hover:not-disabled:bg-sky-600 active:not-disabled:border-b-0 disabled:cursor-not-allowed dark:border-b-sky-700 dark:bg-sky-500 dark:hover:not-disabled:border-sky-900 dark:hover:not-disabled:bg-sky-800"
          >
            {updating ? 'Updating patient...' : 'Update patient'}
          </button>
        </div>
        {error && (
          <AlertComponent
            type="error"
            title="Error updating the patient"
            text={error}
          />
        )}
        {localError && (
          <AlertComponent
            type="error"
            title="Error updating the patient"
            text={localError}
          />
        )}
      </article>
    </section>
  );
}
