import {beforeEach, describe, expect, test} from 'vitest';
import {redirectLegacyHashRoute} from './redirect-legacy-hash-route.ts';

describe('redirectLegacyHashRoute', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  test('turns a hash route into a path', () => {
    window.history.replaceState(null, '', '/#/pending-patients?page=2');

    redirectLegacyHashRoute(window.location, window.history);

    expect(window.location.pathname).toBe('/pending-patients');
    expect(window.location.search).toBe('?page=2');
    expect(window.location.hash).toBe('');
  });

  test.each(['/login', '/#access_token=fake-token', '/#section'])(
    'leaves %s alone',
    (url) => {
      window.history.replaceState(null, '', url);

      redirectLegacyHashRoute(window.location, window.history);

      expect(window.location.pathname + window.location.hash).toBe(url);
    }
  );
});
