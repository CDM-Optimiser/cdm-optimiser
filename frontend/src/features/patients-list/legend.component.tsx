interface LegendComponentProps {
  totalPatients: number;
  acceptedPatientsText: string;
  refusedPatientsText: string;
  pendingPatientsText: string;
}

export function LegendComponent({
  totalPatients,
  acceptedPatientsText,
  refusedPatientsText,
  pendingPatientsText,
}: LegendComponentProps) {
  return (
    <div className="flex w-full flex-col flex-wrap gap-4 rounded-xl bg-white p-4 shadow-md xl:w-auto dark:bg-white/5 dark:ring dark:ring-gray-600">
      <div className="flex justify-center gap-2">
        Total patients: <span className="font-medium">{totalPatients}</span>
      </div>
      <div className="flex flex-wrap items-center gap-6 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            className="stroke-black stroke-2 text-green-200 dark:stroke-white dark:text-emerald-300"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3z" />
          </svg>
          <span>{acceptedPatientsText}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            className="stroke-black stroke-2 text-red-200 dark:stroke-white dark:text-rose-300"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3z" />
          </svg>
          <span>{refusedPatientsText}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            className="dark:bg-white/5"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
          </svg>
          <span>{pendingPatientsText}</span>
        </div>
      </div>
    </div>
  );
}
