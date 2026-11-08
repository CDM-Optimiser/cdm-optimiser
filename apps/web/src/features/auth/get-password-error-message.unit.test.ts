import {describe, expect, test} from 'vitest';
import {AuthApiError, AuthWeakPasswordError} from '@supabase/supabase-js';
import {getPasswordErrorMessage} from './get-password-error-message.ts';

describe('getPasswordErrorMessage', () => {
  test('a password that is too short gives the minimum length', () => {
    const error = new AuthWeakPasswordError(
      'Password should be at least 16 characters.',
      422,
      ['length']
    );

    expect(getPasswordErrorMessage(error)).toBe(
      'Your new password must be at least 16 characters long.'
    );
  });

  test('a leaked password says so', () => {
    const error = new AuthWeakPasswordError('Password is known', 422, [
      'pwned',
    ]);

    expect(getPasswordErrorMessage(error)).toBe(
      'This password has appeared in a data leak, so attackers may try it. Choose another.'
    );
  });

  test('several reasons are all given', () => {
    const error = new AuthWeakPasswordError('Weak', 422, ['length', 'pwned']);

    expect(getPasswordErrorMessage(error)).toContain('at least 16 characters');
    expect(getPasswordErrorMessage(error)).toContain('data leak');
  });

  test.each([
    ['current_password_mismatch', 'Your current password is wrong.'],
    ['current_password_required', 'Enter your current password.'],
    [
      'same_password',
      'Your new password must be different from your current one.',
    ],
    [
      'reauthentication_needed',
      'For your security, sign out and sign in again, then change your password.',
    ],
  ])('Supabase’s %s code is put in plain words', (code, message) => {
    const error = new AuthApiError('Supabase’s own wording', 400, code);

    expect(getPasswordErrorMessage(error)).toBe(message);
  });

  test('an unknown Supabase code falls back to Supabase’s message', () => {
    const error = new AuthApiError(
      'Database error updating user',
      500,
      'unexpected_failure'
    );

    expect(getPasswordErrorMessage(error)).toBe('Database error updating user');
  });

  test('any other error gives its message', () => {
    expect(getPasswordErrorMessage(new Error('Failed to fetch'))).toBe(
      'Failed to fetch'
    );
  });
});
