// The look shared by every list that opens under a button (the dropdown and
// the menu button), so they stay the same: change them here, once.

/** The list. Add `left-0` or `right-0` to line it up with the trigger. */
export const POPUP_LIST =
  'absolute top-full z-10 flex min-w-full flex-col overflow-hidden rounded-md bg-white p-0 shadow-md ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-600';

/** Each `<li>`: a divider between entries. */
export const POPUP_ENTRY =
  'not-last:border-b not-last:border-gray-200 dark:not-last:border-gray-600';

/**
 * The button or link in each entry. The list would clip a focus ring, so
 * focus fills the entry instead, like hover. The selected option, or a
 * link to the current page, is bold.
 */
export const POPUP_ITEM =
  'flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left whitespace-nowrap transition duration-200 ease-in-out hover:bg-sky-700 hover:text-white focus-visible:bg-sky-700 focus-visible:text-white focus-visible:outline-none aria-pressed:font-semibold aria-[current=page]:font-semibold';
