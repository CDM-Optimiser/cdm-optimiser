import {type ChangeEvent} from 'react';
import type {Patient} from '../../utils/types/patient.ts';

interface PatientCardProps {
  patient: Patient;
  index: number;
  onCalledChange?: (index: number, value: boolean) => void;
  onAcceptedChange?: (index: number, value: boolean) => void;
}

export function PatientCardComponent({
  patient,
  index,
  onCalledChange,
  onAcceptedChange,
}: PatientCardProps) {
  const handleCalledToggle = (event: ChangeEvent<HTMLInputElement>) => {
    onCalledChange?.(index, event.target.checked);
  };

  const handleAcceptedToggle = (event: ChangeEvent<HTMLInputElement>) => {
    onAcceptedChange?.(index, event.target.checked);
  };

  return (
    <section className="mx-auto max-w-7xl">
      <div>
        <article className="patient-sheet">
          <header className="border-b border-gray-200">
            <div className="flex items-center gap-4 pb-4">
              <h1 className="text-2xl">Patient Information</h1>
            </div>
          </header>
          <section className="grid grid-cols-2 gap-6 p-4">
            <div className="col-span-2 flex flex-col gap-2">
              <strong>Name</strong>
              <span>{patient.name}</span>
            </div>
            <div className="flex flex-col gap-2">
              <strong>GMS number</strong> <span>{patient['gms number']}</span>
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
              <strong>Phone</strong>
              <span>{patient.phone}</span>
            </div>
            <div className="col-span-2 mt-4 flex items-center justify-center gap-4">
              <strong>Asthma:</strong>
              {patient.asthma === '1' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-red-400"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12h2" />
                  <path d="M17 12h2" />
                  <path d="M11 12h2" />
                </svg>
              )}
              <strong>DM:</strong>
              {patient.dm === '1' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-red-400"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12h2" />
                  <path d="M17 12h2" />
                  <path d="M11 12h2" />
                </svg>
              )}
              <strong>CVD:</strong>
              {patient.cvd === '1' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-red-400"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12h2" />
                  <path d="M17 12h2" />
                  <path d="M11 12h2" />
                </svg>
              )}
              <strong>COPD:</strong>
              {patient.copd === '1' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-red-400"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12h2" />
                  <path d="M17 12h2" />
                  <path d="M11 12h2" />
                </svg>
              )}
            </div>
          </section>
          <div className="patient-actions patient-actions flex items-center gap-2 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-md ms-3 font-medium select-none">
                Called?
              </span>
              <div className="group relative inline-flex h-6 w-12 rounded-full bg-red-400 p-0.5 outline-offset-2 transition duration-200 ease-in-out has-checked:bg-green-500">
                <span className="relative inline-flex h-5 w-5 rounded-full bg-white p-2 ring-1 ring-red-400 transition duration-200 ease-in-out group-has-[input:checked]:translate-x-6 group-has-[input:checked]:ring-sky-500">
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
                  checked={patient.called ?? false}
                  onChange={handleCalledToggle}
                  className="absolute inset-0 appearance-none"
                />
              </div>
            </div>
            {patient.called && (
              <div className="flex items-center gap-2">
                <span className="text-md ms-3 font-medium select-none">
                  Accepted?
                </span>
                <div className="group relative inline-flex h-6 w-12 rounded-full bg-red-400 p-0.5 outline-offset-2 transition duration-200 ease-in-out has-checked:bg-green-500">
                  <span className="relative inline-flex h-5 w-5 rounded-full bg-white p-2 ring-1 ring-red-400 transition duration-200 ease-in-out group-has-[input:checked]:translate-x-6 group-has-[input:checked]:ring-sky-500">
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
                    checked={patient.accepted ?? false}
                    onChange={handleAcceptedToggle}
                    className="absolute inset-0 appearance-none"
                  />
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
