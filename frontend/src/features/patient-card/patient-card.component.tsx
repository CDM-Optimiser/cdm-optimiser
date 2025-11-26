import {type ChangeEvent} from 'react';
import type {Patient} from '../../utils/types/patient.ts';
import {SVGComponent} from '../ui/svg.component.tsx';

interface PatientCardProps {
  patient: Patient;
  index: number;
  onAcceptedChange?: (index: number, value: boolean) => void;
  onRefusedChange?: (index: number, value: boolean) => void;
}

export function PatientCardComponent({
  patient,
  index,
  onAcceptedChange,
  onRefusedChange,
}: PatientCardProps) {
  const handleAcceptedToggle = (event: ChangeEvent<HTMLInputElement>) => {
    onAcceptedChange?.(index, event.target.checked);
  };

  const handleRefusedToggle = (event: ChangeEvent<HTMLInputElement>) => {
    onRefusedChange?.(index, event.target.checked);
  };

  return (
    <section className="mx-auto max-w-7xl">
      <div>
        <article className="patient-sheet">
          <header className="border-b border-gray-200">
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4">
              <h1 className="text-2xl">Patient Information</h1>
              <div className="flex items-center gap-2">
                <span className="font-bold">Potential income:</span>
                <span>€ {patient.potential_income}</span>
              </div>
            </div>
          </header>
          <section className="grid grid-cols-2 gap-6 p-4">
            <div className="flex flex-col gap-2">
              <strong>Name</strong>
              <span>{patient.name}</span>
            </div>
            <div className="flex flex-col gap-2">
              <strong>GMS number</strong> <span>{patient.gms}</span>
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
          <div className="patient-actions patient-actions flex items-center gap-2 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-md ms-3 font-medium select-none">
                Accepted
              </span>
              <div className="group relative inline-flex h-6 w-12 rounded-xl bg-red-400 p-0.5 outline-offset-2 transition duration-200 ease-in-out has-checked:bg-green-500">
                <span className="relative inline-flex h-5 w-5 rounded-xl bg-white p-2 ring-1 ring-red-400 transition duration-200 ease-in-out group-has-[input:checked]:translate-x-6 group-has-[input:checked]:ring-sky-500">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex h-full w-full items-center justify-center opacity-100 transition-opacity duration-200 ease-in-out group-has-[input:checked]:opacity-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M18 6l-12 12" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex h-full w-full appearance-none items-center justify-center opacity-0 transition-opacity duration-100 ease-in-out group-has-[input:checked]:opacity-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                    </svg>
                  </span>
                </span>
                <input
                  type="checkbox"
                  name="patient-called"
                  title="toggle"
                  checked={patient.accepted}
                  onChange={handleAcceptedToggle}
                  className="absolute inset-0 cursor-pointer appearance-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-md ms-3 font-medium select-none">
                Refused
              </span>
              <div className="group relative inline-flex h-6 w-12 rounded-xl bg-red-400 p-0.5 outline-offset-2 transition duration-200 ease-in-out has-checked:bg-green-500">
                <span className="relative inline-flex h-5 w-5 rounded-xl bg-white p-2 ring-1 ring-red-400 transition duration-200 ease-in-out group-has-[input:checked]:translate-x-6 group-has-[input:checked]:ring-sky-500">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex h-full w-full items-center justify-center opacity-100 transition-opacity duration-200 ease-in-out group-has-[input:checked]:opacity-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M18 6l-12 12" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex h-full w-full appearance-none items-center justify-center opacity-0 transition-opacity duration-100 ease-in-out group-has-[input:checked]:opacity-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  </span>
                </span>
                <input
                  type="checkbox"
                  name="patient-called"
                  title="toggle"
                  checked={patient.refused}
                  onChange={handleRefusedToggle}
                  className="absolute inset-0 cursor-pointer appearance-none"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
