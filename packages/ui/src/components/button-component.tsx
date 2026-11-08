import type {ComponentProps} from 'react';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ComponentProps<'button'> {
  /**
   * `primary`: the main action of a screen or form, and the selected option
   * in a group (the active filter, the current page).
   * `secondary`: every other button, including the unselected options.
   */
  variant?: ButtonVariant;
}

// Colours are set for `enabled:` and `disabled:` separately, so a disabled
// button never picks up a variant's colour, in light or dark mode.
//
// Pressing it moves the face down onto its 4px bottom edge: the edge goes
// and a 4px top margin takes its place, so the button's outer size, and
// the layout around it, stay the same. Space buttons with the parent's
// `gap`, not with vertical margins, which pressing would override.
const BASE =
  'rounded-md border-b-4 px-4 py-2 transition duration-200 ease-in-out enabled:cursor-pointer enabled:active:mt-1 enabled:active:border-b-0 disabled:cursor-not-allowed disabled:border-gray-200 disabled:border-b-gray-400 disabled:bg-gray-200 disabled:text-gray-600 dark:disabled:border-gray-700 dark:disabled:border-b-gray-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-300';

// White on sky-700 is 5.85:1, sky-900 on sky-100 8.24:1 and sky-100 on
// sky-950 12.1:1 (WCAG AA needs 4.5:1). The primary button reads well on
// light and dark pages alike, so it has no dark: variant.
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'enabled:border-sky-700 enabled:border-b-sky-900 enabled:bg-sky-700 enabled:text-white enabled:hover:border-sky-800 enabled:hover:border-b-sky-950 enabled:hover:bg-sky-800',
  secondary:
    'enabled:border-sky-100 enabled:border-b-sky-300 enabled:bg-sky-100 enabled:text-sky-900 enabled:hover:border-sky-200 enabled:hover:border-b-sky-400 enabled:hover:bg-sky-200 dark:enabled:border-sky-950 dark:enabled:border-b-sky-800 dark:enabled:bg-sky-950 dark:enabled:text-sky-100 dark:enabled:hover:border-sky-900 dark:enabled:hover:bg-sky-900',
};

/**
 * The app's button, in the colour-system recipe. `className` is for layout
 * only (margins, width, padding); colours come from `variant`. Defaults to
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
