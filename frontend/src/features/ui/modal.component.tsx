import type {ReactNode} from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export function ModalComponent({isOpen, onClose, children}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:ring dark:ring-gray-600">
        <button
          type="button"
          title="Close modal"
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-xl font-bold text-red-500 transition duration-300 ease-in-out hover:text-white dark:text-white dark:hover:text-red-500"
        >
          <span className="sr-only">Close modal</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="fill-white hover:fill-red-500 dark:fill-red-600 dark:hover:fill-white"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" />
            <path d="M9 9l6 6m0 -6l-6 6" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
