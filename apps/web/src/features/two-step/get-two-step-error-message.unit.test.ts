import {describe, expect, test} from 'vitest';
import {AuthApiError} from '@supabase/supabase-js';
import {getTwoStepErrorMessage} from './get-two-step-error-message.ts';

describe('getTwoStepErrorMessage', () => {
  test.each([
    ['mfa_verification_failed', /That code didn’t work/],
    ['mfa_challenge_expired', /That took too long/],
    ['mfa_factor_name_conflict', /already have an app with this name/],
    ['over_request_rate_limit', /Too many attempts/],
  ])('Supabase’s %s code is put in plain words', (code, message) => {
    const error = new AuthApiError('Supabase’s own wording', 400, code);

    expect(getTwoStepErrorMessage(error)).toMatch(message);
  });

  test('an unknown code falls back to Supabase’s message', () => {
    const error = new AuthApiError('Something else', 500, 'unexpected_failure');

    expect(getTwoStepErrorMessage(error)).toBe('Something else');
  });

  test('any other error gives its message', () => {
    expect(getTwoStepErrorMessage(new Error('Failed to fetch'))).toBe(
      'Failed to fetch'
    );
  });
});
