import {
  isAuthError,
  isAuthWeakPasswordError,
  type WeakPasswordReasons,
} from '@supabase/supabase-js';
import {getErrorMessage} from '../../lib/get-error-message.ts';
import {MIN_PASSWORD_LENGTH} from './password-rules.ts';

const WEAK_PASSWORD_MESSAGES: Record<WeakPasswordReasons, string> = {
  length: `Your new password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
  pwned:
    'This password has appeared in a data leak, so attackers may try it. Choose another.',
  characters: 'Your new password is missing a required type of character.',
};

// Supabase's error codes for a password change, in plain words.
const MESSAGES: Partial<Record<string, string>> = {
  current_password_required: 'Enter your current password.',
  current_password_mismatch: 'Your current password is wrong.',
  same_password: 'Your new password must be different from your current one.',
  // Only if "Secure password change" is turned on (runbook P1 says to leave
  // it off): a fresh sign-in makes the change possible again.
  reauthentication_needed:
    'For your security, sign out and sign in again, then change your password.',
  over_request_rate_limit:
    'Too many attempts. Wait a few minutes, then try again.',
};

/** Why Supabase refused a new password, in words the user can act on. */
export function getPasswordErrorMessage(error: unknown): string {
  if (isAuthWeakPasswordError(error) && error.reasons.length > 0) {
    return error.reasons
      .map((reason) => WEAK_PASSWORD_MESSAGES[reason] ?? error.message)
      .join(' ');
  }

  if (isAuthError(error) && error.code) {
    return MESSAGES[error.code] ?? getErrorMessage(error);
  }

  return getErrorMessage(error);
}
