import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import {SquareXIcon} from '../icons/square-x-icon.tsx';

interface ModalProps {
  isOpen: boolean;
  /** Called on the close button, the Escape key and a click on the backdrop. */
  onClose?: () => void;
  /** The id of the heading inside `children` that names the dialog. */
  labelledBy?: string;
  children: ReactNode;
}

/**
 * A modal dialog built on the native `<dialog>` element. `showModal()` gives
 * focus trapping, the Escape key, the top layer (so no parent `overflow` can
 * clip it) and focus returning to the opener on close, all from the browser.
 * The parent stays in control: Escape and backdrop clicks call `onClose`,
 * and `isOpen` decides whether the dialog is shown.
 */
export function ModalComponent({
  isOpen,
  onClose,
  labelledBy,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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
      aria-labelledby={labelledBy}
      onCancel={handleCancel}
      onClick={handleClick}
      className="m-auto w-full max-w-2xl rounded-lg bg-white p-0 text-inherit shadow-lg backdrop:bg-black/70 dark:bg-gray-800 dark:ring dark:ring-gray-600"
    >
      {isOpen && (
        <div className="relative p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 cursor-pointer text-red-500 transition duration-300 ease-in-out hover:text-white dark:text-white dark:hover:text-red-500"
          >
            <span className="sr-only">Close dialog</span>
            <SquareXIcon
              width={36}
              height={36}
              fill="currentColor"
              className="fill-white hover:fill-red-500 dark:fill-red-600 dark:hover:fill-white"
            />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
