import {describe, expect, test} from 'vitest';
import type {User} from '@supabase/supabase-js';
import {isDemoAccount} from './is-demo-account.ts';

const userWith = (appMetadata: User['app_metadata']) =>
  ({id: 'test-user', app_metadata: appMetadata}) as User;

describe('isDemoAccount', () => {
  test('is true for a user marked as the demo account', () => {
    expect(isDemoAccount(userWith({provider: 'email', demo: true}))).toBe(true);
  });

  test.each([
    ['no mark', userWith({provider: 'email'})],
    ['a mark that is not true', userWith({demo: 'true'})],
    ['no user', null],
  ])('is false with %s', (_label, user) => {
    expect(isDemoAccount(user)).toBe(false);
  });
});
