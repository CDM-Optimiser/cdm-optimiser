import {useEffect, useId, useRef, useState, type ReactNode} from 'react';
import {ButtonComponent} from './button-component.tsx';

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
      <ButtonComponent
        ref={triggerRef}
        variant="secondary"
        className="flex items-center gap-2"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={`${labelPrefix}: ${selectedItem?.label ?? ''}`}
      >
        <span>{selectedItem?.icon}</span>
        <span>{selectedItem?.label}</span>
      </ButtonComponent>

      <ul
        id={listId}
        hidden={!isOpen}
        className="absolute top-full left-0 z-10 flex min-w-full flex-col overflow-hidden rounded-md bg-white p-0 shadow-md ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-600"
      >
        {options.map((option) => (
          <li
            key={option.value}
            className="not-last:border-b not-last:border-gray-200 dark:not-last:border-gray-600"
          >
            {/* The list would clip a focus ring, so focus fills the option
                instead, like hover. The selected option is bold. */}
            <button
              type="button"
              aria-pressed={option.value === selectedValue}
              onClick={() => handleSelect(option.value)}
              className="flex w-full cursor-pointer gap-2 px-4 py-2 text-left transition duration-200 ease-in-out hover:bg-sky-700 hover:text-white focus-visible:bg-sky-700 focus-visible:text-white focus-visible:outline-none aria-pressed:font-semibold"
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
