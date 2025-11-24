interface FiltersComponentProps {
  filterSelected: 'all' | 'accepted' | 'refused';
  onFilterChange?: (filter: 'all' | 'accepted' | 'refused') => void;
}

export function FiltersComponent({
  filterSelected,
  onFilterChange: onFilterChange,
}: FiltersComponentProps) {
  const handleFilterChange = (filter: 'all' | 'accepted' | 'refused') => {
    onFilterChange?.(filter);
  };

  return (
    <div className="flex flex-col flex-wrap gap-4 rounded-xl bg-white p-4 shadow-md">
      <span>Filters:</span>
      <div className="flex gap-2">
        <button
          className={`rounded px-4 py-2 ${filterSelected === 'all' ? 'bg-sky-500 text-white' : 'bg-gray-200'} transition duration-200 ease-in-out hover:bg-sky-200`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`rounded px-4 py-2 ${filterSelected === 'accepted' ? 'bg-sky-500 text-white' : 'bg-gray-200'} transition duration-200 ease-in-out hover:bg-sky-200`}
          onClick={() => handleFilterChange('accepted')}
        >
          Accepted patients
        </button>
        <button
          className={`rounded px-4 py-2 ${filterSelected === 'refused' ? 'bg-sky-500 text-white' : 'bg-gray-200'} transition duration-200 ease-in-out hover:bg-sky-200`}
          onClick={() => handleFilterChange('refused')}
        >
          Refused patients
        </button>
      </div>
    </div>
  );
}
