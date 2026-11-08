import {useId, useRef, useState, type ReactNode} from 'react';
import {useDismissPopup} from '../hooks/use-dismiss-popup.ts';
import {ChevronDownIcon} from '../icons/chevron-down-icon.tsx';
import {ButtonComponent} from './button-component.tsx';
import {POPUP_ENTRY, POPUP_ITEM, POPUP_LIST} from './popup-classes.ts';

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

  useDismissPopup(isOpen, () => setIsOpen(false), containerRef, triggerRef);

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
        <ChevronDownIcon className="ml-auto shrink-0" />
      </ButtonComponent>

      <ul id={listId} hidden={!isOpen} className={`${POPUP_LIST} left-0`}>
        {options.map((option) => (
          <li key={option.value} className={POPUP_ENTRY}>
            <button
              type="button"
              aria-pressed={option.value === selectedValue}
              onClick={() => handleSelect(option.value)}
              className={POPUP_ITEM}
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
