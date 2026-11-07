import {useEffect, useId, useRef, useState, type ReactNode} from 'react';

export interface DropdownItem<T extends string> {
  value: T;
  label: string;
  icon: ReactNode;
}

interface DropdownProps<T extends string> {
  options: DropdownItem<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  /** Prefix of the trigger's accessible name, e.g. "Theme" → "Theme: Light". */
  labelPrefix?: string;
}

/**
 * A button that shows a list of options (the WAI-ARIA disclosure pattern).
 * Every option is a real button: Tab moves through them, Enter or Space
 * picks one. Escape or a click outside closes the list, and Escape returns
 * focus to the trigger.
 */
export function DropdownComponent<T extends string>({
  options,
  selectedValue,
  onSelect,
  labelPrefix = 'Select',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const selectedItem = options.find((option) => option.value === selectedValue);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (value: T) => {
    onSelect(value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="relative flex w-32 min-w-max flex-col gap-4"
    >
      <button
        ref={triggerRef}
        type="button"
        className="flex cursor-pointer gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-900 ring ring-gray-600 dark:bg-white/5 dark:text-white"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={`${labelPrefix}: ${selectedItem?.label ?? ''}`}
      >
        <span>{selectedItem?.icon}</span>
        <span>{selectedItem?.label}</span>
      </button>

      <ul
        id={listId}
        hidden={!isOpen}
        className="absolute top-full left-0 z-10 flex min-w-full flex-col overflow-hidden rounded-md bg-white p-0 shadow-md dark:bg-gray-600"
      >
        {options.map((option) => (
          <li
            key={option.value}
            className="not-last:border-b not-last:border-b-gray-400"
          >
            <button
              type="button"
              aria-pressed={option.value === selectedValue}
              onClick={() => handleSelect(option.value)}
              className="flex w-full cursor-pointer gap-2 px-4 py-2 text-left transition duration-300 ease-in-out hover:bg-sky-500 hover:text-white focus-visible:bg-sky-500 focus-visible:text-white"
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
