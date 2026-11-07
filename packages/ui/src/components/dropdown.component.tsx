import {useState, useCallback, type ReactNode} from 'react';

export interface DropdownItem<T extends string> {
  value: T;
  label: string;
  icon: ReactNode;
}

interface DropdownProps<T extends string> {
  options: DropdownItem<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  labelPrefix?: string;
}

export function DropdownComponent<T extends string>({
  options,
  selectedValue,
  onSelect,
  labelPrefix = 'Select',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = options.find((option) => option.value === selectedValue);
  const selectedIcon = selectedItem?.icon;
  const selectedLabel = selectedItem?.label;

  const handleSelect = useCallback(
    (value: T) => {
      onSelect(value);
      setIsOpen(false);
    },
    [onSelect]
  );

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative flex w-32 min-w-max flex-col gap-4">
      <button
        className="flex cursor-pointer gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-900 ring ring-gray-600 dark:bg-white/5 dark:text-white"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${labelPrefix}: ${selectedLabel}`}
      >
        <span>{selectedIcon}</span>
        <span>{selectedLabel}</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 flex min-w-full flex-col overflow-hidden rounded-md bg-white p-0 shadow-md dark:bg-gray-600"
          role="listbox"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="flex cursor-pointer gap-2 overflow-hidden px-4 py-2 transition duration-300 ease-in-out not-last:border-b not-last:border-b-gray-400 hover:bg-sky-500 hover:text-white"
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={selectedValue === option.value}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
