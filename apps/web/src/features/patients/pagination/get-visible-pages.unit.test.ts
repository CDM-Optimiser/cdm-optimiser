import {describe, expect, test} from 'vitest';
import {getVisiblePages} from './get-visible-pages.ts';

describe('getVisiblePages', () => {
  test('shows every page when there are few', () => {
    expect(getVisiblePages(1, 1)).toEqual([1]);
    expect(getVisiblePages(2, 4)).toEqual([1, 2, 3, 4]);
  });

  test('on the first page: the next pages, a gap, the last page', () => {
    expect(getVisiblePages(1, 10)).toEqual([1, 2, 3, 'gap-end', 10]);
  });

  test('in the middle: gaps on both sides', () => {
    expect(getVisiblePages(5, 10)).toEqual([
      1,
      'gap-start',
      4,
      5,
      6,
      'gap-end',
      10,
    ]);
  });

  test('on the last page: the first page, a gap, the last pages', () => {
    expect(getVisiblePages(10, 10)).toEqual([1, 'gap-start', 8, 9, 10]);
  });

  test('always includes the current page', () => {
    for (let current = 1; current <= 30; current++) {
      expect(getVisiblePages(current, 30)).toContain(current);
    }
  });
});
