export const getVisiblePages = (
  current: number,
  total: number,
  maxButtons = 4
): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (total <= maxButtons) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
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

  pages.push(1);

  if (start > 2) pages.push('…');

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < total - 1) pages.push('…');

  pages.push(total);

  return pages;
};
