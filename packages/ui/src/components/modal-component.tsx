import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import {SquareXIcon} from '../icons/square-x-icon.tsx';

interface ModalProps {
  isOpen: boolean;
  /** The dialog's heading, which also names it for screen readers. */
  title: string;
  /** Called on the close button, the Escape key and a click on the backdrop. */
  onClose?: () => void;
  children: ReactNode;
}

/**
 * A modal dialog built on the native `<dialog>` element. `showModal()` gives
 * focus trapping, the Escape key, the top layer (so no parent `overflow` can
 * clip it) and focus returning to the opener on close, all from the browser.
 * The parent stays in control: Escape and backdrop clicks call `onClose`,
 * and `isOpen` decides whether the dialog is shown.
 */
export function ModalComponent({isOpen, title, onClose, children}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Escape: let the parent decide, so `isOpen` stays the source of truth.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose?.();
  };

  // A click on the backdrop targets the <dialog> itself; clicks on the
  // content target its children.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
      className="m-auto w-full max-w-2xl rounded-lg bg-white p-0 text-inherit shadow-lg backdrop:bg-black/70 dark:bg-gray-800 dark:ring dark:ring-gray-600"
    >
      {isOpen && (
        <div className="flex flex-col gap-6 p-6">
          {/* The title and the close button share one row, so they line up
              whatever the title's length or the dialog's width. */}
          <header className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-600">
            <h2 id={titleId} className="text-2xl">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer rounded-md text-gray-500 transition duration-200 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <span className="sr-only">Close dialog</span>
              {/* Neutral: red is kept for refused patients and errors. */}
              <SquareXIcon width={36} height={36} />
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}
