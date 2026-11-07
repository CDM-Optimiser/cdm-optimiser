import type {ButtonHTMLAttributes} from 'react';

export type ButtonVariant = 'primary' | 'segment';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * `primary`: the main action of a screen or form.
   * `segment`: one option in a group of toggles (filters). Set
   * `aria-pressed` on the selected one; it gets the darker pressed style.
   */
  variant?: ButtonVariant;
}

const BASE =
  'rounded-md border-b-4 px-4 py-2 transition duration-200 ease-in-out disabled:cursor-not-allowed';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'border-sky-500 border-b-sky-600 bg-sky-500 text-white hover:not-disabled:border-sky-800 hover:not-disabled:bg-sky-600 active:not-disabled:border-b-0 disabled:border-b-gray-500 disabled:bg-gray-200 disabled:text-gray-600 dark:border-b-sky-700 dark:bg-sky-500 dark:hover:not-disabled:border-sky-900 dark:hover:not-disabled:bg-sky-800',
  segment:
    'border-sky-500 border-b-sky-600 bg-sky-500 text-white hover:not-disabled:border-sky-800 hover:not-disabled:bg-sky-600 active:not-disabled:border-b-0 aria-pressed:border-sky-900 aria-pressed:bg-sky-700 dark:border-b-sky-700 dark:bg-sky-500 dark:hover:not-disabled:border-sky-900 dark:hover:not-disabled:bg-sky-800 dark:aria-pressed:border-b-sky-900 dark:aria-pressed:bg-sky-700',
};

/**
 * The app's button, in the colour-system recipe. `className` is for layout
 * only (margins, width); colours come from `variant`. Defaults to
 * `type="button"` so it never submits a form by accident.
 */
export function ButtonComponent({
  variant = 'primary',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[BASE, VARIANTS[variant], className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
