import {isAuthError} from '@supabase/supabase-js';
import {getErrorMessage} from '../../lib/get-error-message.ts';

// Supabase's error codes for two-step sign-in, in plain words.
const MESSAGES: Partial<Record<string, string>> = {
  mfa_verification_failed:
    'That code didn’t work. Enter the code your app shows now: it changes every 30 seconds.',
  mfa_challenge_expired:
    'That took too long. Enter the code your app shows now.',
  mfa_factor_name_conflict:
    'You already have an app with this name. Choose another name.',
  too_many_enrolled_mfa_factors:
    'You have the most authenticator apps allowed. Remove one first.',
  mfa_totp_enroll_not_enabled:
    'Two-step sign-in is switched off in Supabase. Ask your administrator.',
  mfa_totp_verify_not_enabled:
    'Two-step sign-in is switched off in Supabase. Ask your administrator.',
  insufficient_aal:
    'For your security, sign out and sign in again, then try again.',
  over_request_rate_limit:
    'Too many attempts. Wait a few minutes, then try again.',
};

/** Why Supabase refused a two-step sign-in action, in words to act on. */
export function getTwoStepErrorMessage(error: unknown): string {
  if (isAuthError(error) && error.code) {
    return MESSAGES[error.code] ?? getErrorMessage(error);
  }

  return getErrorMessage(error);
}
