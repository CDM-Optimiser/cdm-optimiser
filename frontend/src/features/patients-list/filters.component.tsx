interface FiltersComponentProps {
  filterSelected: 'all' | 'accepted' | 'refused' | 'pending';
  onFilterChange?: (filter: 'all' | 'accepted' | 'refused' | 'pending') => void;
}

export function FiltersComponent({
  filterSelected,
  onFilterChange: onFilterChange,
}: FiltersComponentProps) {
  const handleFilterChange = (
    filter: 'all' | 'accepted' | 'refused' | 'pending'
  ) => {
    onFilterChange?.(filter);
  };

  return (
    <div className="flex w-full flex-1 flex-col flex-wrap gap-4 rounded-xl bg-white p-4 shadow-md xl:w-auto dark:bg-white/5 dark:ring dark:ring-gray-600">
      <span>Filters:</span>
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-md border-b-4 border-sky-500 border-b-sky-600 bg-sky-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:text-white hover:not-disabled:border-sky-800 hover:not-disabled:bg-sky-600 active:not-disabled:border-b-0 disabled:cursor-not-allowed dark:border-b-sky-700 dark:bg-sky-500 dark:hover:not-disabled:border-sky-900 dark:hover:not-disabled:bg-sky-800 ${
            filterSelected === 'all'
              ? `border-sky-900 bg-sky-700 text-white dark:border-b-sky-900 dark:bg-sky-700`
              : ''
          } `}
          disabled={filterSelected === 'all'}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          type="button"
          className={`rounded-md border-b-4 border-sky-500 border-b-sky-600 bg-sky-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:text-white hover:not-disabled:border-sky-800 hover:not-disabled:bg-sky-600 active:not-disabled:border-b-0 disabled:cursor-not-allowed dark:border-b-sky-700 dark:bg-sky-500 dark:hover:not-disabled:border-sky-900 dark:hover:not-disabled:bg-sky-800 ${
            filterSelected === 'accepted'
              ? `border-sky-900 bg-sky-700 text-white dark:border-b-sky-900 dark:bg-sky-700`
              : ''
          } `}
          disabled={filterSelected === 'accepted'}
          onClick={() => handleFilterChange('accepted')}
        >
          Accepted patients
        </button>
        <button
          type="button"
          className={`rounded-md border-b-4 border-sky-500 border-b-sky-600 bg-sky-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:text-white hover:not-disabled:border-sky-800 hover:not-disabled:bg-sky-600 active:not-disabled:border-b-0 disabled:cursor-not-allowed dark:border-b-sky-700 dark:bg-sky-500 dark:hover:not-disabled:border-sky-900 dark:hover:not-disabled:bg-sky-800 ${
            filterSelected === 'refused'
              ? `border-sky-900 bg-sky-700 text-white dark:border-b-sky-900 dark:bg-sky-700`
              : ''
          } `}
          disabled={filterSelected === 'refused'}
          onClick={() => handleFilterChange('refused')}
        >
          Refused patients
        </button>
        <button
          type="button"
          className={`rounded-md border-b-4 border-sky-500 border-b-sky-600 bg-sky-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:text-white hover:not-disabled:border-sky-800 hover:not-disabled:bg-sky-600 active:not-disabled:border-b-0 disabled:cursor-not-allowed dark:border-b-sky-700 dark:bg-sky-500 dark:hover:not-disabled:border-sky-900 dark:hover:not-disabled:bg-sky-800 ${
            filterSelected === 'pending'
              ? `border-sky-900 bg-sky-700 text-white dark:border-b-sky-900 dark:bg-sky-700`
              : ''
          } `}
          disabled={filterSelected === 'pending'}
          onClick={() => handleFilterChange('pending')}
        >
          Pending patients
        </button>
      </div>
    </div>
  );
}
