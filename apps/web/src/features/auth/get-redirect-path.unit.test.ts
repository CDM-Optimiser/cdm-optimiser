import {describe, expect, test} from 'vitest';
import {getRedirectPath} from './get-redirect-path.ts';

describe('getRedirectPath', () => {
  test('returns the page the user was sent away from', () => {
    expect(getRedirectPath({from: '/pending-patients'})).toBe(
      '/pending-patients'
    );
  });

  test.each([
    ['no state', null],
    ['no from', {}],
    ['a non-string from', {from: 42}],
    ['a relative path', {from: 'pending-patients'}],
    ['a protocol-relative URL', {from: '//example.com'}],
    ['an absolute URL', {from: 'https://example.com'}],
  ])('falls back to the patients list with %s', (_case, state) => {
    expect(getRedirectPath(state)).toBe('/');
  });
});
