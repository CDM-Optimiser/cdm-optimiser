import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import {SquareXIcon} from '../icons/square-x-icon.tsx';

export type ModalPlacement = 'center' | 'end';

interface ModalProps {
  isOpen: boolean;
  /**
   * `center`: a dialog in the middle of the screen.
   * `end`: a drawer, full height on the right, sliding in as it opens.
   */
  placement?: ModalPlacement;
  /** The dialog's heading, which also names it for screen readers. */
  title: string;
  /** Called on the close button, the Escape key and a click on the backdrop. */
  onClose?: () => void;
  children: ReactNode;
}

const PLACEMENTS: Record<ModalPlacement, string> = {
  center: 'm-auto w-full max-w-2xl rounded-lg',
  // Slides in on opening (@starting-style), unless the user asked for less
  // motion. Closing is instant.
  end: 'my-0 ms-auto me-0 h-dvh max-h-dvh w-80 max-w-full transition-transform duration-300 ease-out starting:open:translate-x-full motion-reduce:transition-none',
};

/**
 * A modal dialog built on the native `<dialog>` element. `showModal()` gives
 * focus trapping, the Escape key, the top layer (so no parent `overflow` can
 * clip it) and focus returning to the opener on close, all from the browser.
 * The parent stays in control: Escape and backdrop clicks call `onClose`,
 * and `isOpen` decides whether the dialog is shown.
 */
export function ModalComponent({
  isOpen,
  placement = 'center',
  title,
  onClose,
  children,
}: ModalProps) {
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
      className={`${PLACEMENTS[placement]} bg-white p-0 text-inherit shadow-lg backdrop:bg-black/70 dark:bg-gray-800 dark:ring dark:ring-gray-600`}
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
