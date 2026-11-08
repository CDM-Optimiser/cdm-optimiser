import type {User} from '@supabase/supabase-js';
import {describe, expect, test} from 'vitest';
import {getUserDisplayName} from './get-user-display-name.ts';

function user(overrides: Partial<User>): User {
  return {
    id: '00000000-0000-4000-8000-000000000001',
    aud: 'authenticated',
    app_metadata: {},
    user_metadata: {},
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('getUserDisplayName', () => {
  test('prefers display_name, then full_name, then name', () => {
    expect(
      getUserDisplayName(
        user({user_metadata: {display_name: 'Dr Test', full_name: 'Other'}})
      )
    ).toBe('Dr Test');
    expect(
      getUserDisplayName(user({user_metadata: {full_name: 'Test User'}}))
    ).toBe('Test User');
    expect(getUserDisplayName(user({user_metadata: {name: ' Test '}}))).toBe(
      'Test'
    );
  });

  test('falls back to the email when there is no usable name', () => {
    expect(
      getUserDisplayName(
        user({email: 'test.user@example.com', user_metadata: {name: '  '}})
      )
    ).toBe('test.user@example.com');
    expect(
      getUserDisplayName(
        user({email: 'test.user@example.com', user_metadata: {name: 42}})
      )
    ).toBe('test.user@example.com');
  });
});
