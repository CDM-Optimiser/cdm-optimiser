import {useId, useRef, useState, type ReactNode} from 'react';
import {useDismissPopup} from '../hooks/use-dismiss-popup.ts';
import {ChevronDownIcon} from '../icons/chevron-down-icon.tsx';
import {ButtonComponent} from './button-component.tsx';
import {POPUP_ENTRY, POPUP_ITEM, POPUP_LIST} from './popup-classes.ts';

interface MenuLinkProps {
  className: string;
  children: ReactNode;
}

/** An entry: a button that runs `onSelect`, or a link the app renders. */
export type MenuButtonItem = {label: string; icon?: ReactNode} & (
  | {onSelect: () => void; renderLink?: never}
  | {
      /**
       * Renders the entry as a link, such as a router `<Link>`, passing on
       * the props given (this package can't import the router).
       */
      renderLink: (props: MenuLinkProps) => ReactNode;
      onSelect?: never;
    }
);

interface MenuButtonProps {
  /** What the button shows, such as an avatar and an email. */
  trigger: ReactNode;
  /**
   * The button's accessible name. Include the text it shows, so people
   * using speech input can say what they see.
   */
  label: string;
  items: MenuButtonItem[];
  /** The edge the list lines up with: `end` for a button at the right. */
  align?: 'start' | 'end';
  /** Layout for the wrapper, such as `w-full`. */
  className?: string;
}

/**
 * A button that opens a short list of actions and links (the WAI-ARIA
 * disclosure pattern, like `DropdownComponent`, which picks one option
 * instead). Tab moves through the entries; choosing one, Escape or a
 * click outside closes the list, and Escape returns focus to the button.
 */
export function MenuButtonComponent({
  trigger,
  label,
  items,
  align = 'start',
  className,
}: MenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const close = () => setIsOpen(false);

  useDismissPopup(isOpen, close, containerRef, triggerRef);

  return (
    <div
      ref={containerRef}
      className={['relative flex min-w-0', className].filter(Boolean).join(' ')}
    >
      <ButtonComponent
        ref={triggerRef}
        variant="secondary"
        className="flex w-full min-w-0 items-center gap-2"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={label}
      >
        {trigger}
        <ChevronDownIcon className="ml-auto shrink-0" />
      </ButtonComponent>

      {/* Any click on an entry, button or link, closes the list. */}
      <ul
        id={listId}
        hidden={!isOpen}
        onClick={close}
        className={`${POPUP_LIST} ${align === 'end' ? 'right-0' : 'left-0'}`}
      >
        {items.map((item) => {
          const content = (
            <>
              {item.icon}
              <span>{item.label}</span>
            </>
          );

          return (
            <li key={item.label} className={POPUP_ENTRY}>
              {item.renderLink ? (
                item.renderLink({className: POPUP_ITEM, children: content})
              ) : (
                <button
                  type="button"
                  onClick={item.onSelect}
                  className={POPUP_ITEM}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
