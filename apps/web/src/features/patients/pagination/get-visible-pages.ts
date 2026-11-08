/** A page number, or a gap in the page list (drawn as "…"). */
export type PageItem = number | 'gap-start' | 'gap-end';

/**
 * The page buttons to show: always the first and last page, a few pages
 * around the current one, and a gap where pages are left out. Gaps have
 * their own names, so each one keeps a stable React key.
 */
export function getVisiblePages(
  current: number,
  total: number,
  maxButtons = 4
): PageItem[] {
  if (total <= maxButtons) {
    return Array.from({length: total}, (_, i) => i + 1);
  }

  const numMiddle = maxButtons - 2;
  let start = current - Math.floor(numMiddle / 2);
  let end = current + Math.floor(numMiddle / 2);

  if (start < 2) {
    start = 2;
    end = start + numMiddle - 1;
  }

  if (end > total - 1) {
    end = total - 1;
    start = end - numMiddle + 1;
  }

  const pages: PageItem[] = [1];

  if (start > 2) pages.push('gap-start');

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < total - 1) pages.push('gap-end');

  pages.push(total);

  return pages;
}
