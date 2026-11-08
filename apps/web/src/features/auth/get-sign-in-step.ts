import type {Session} from '@supabase/supabase-js';
import {isDemoAccount} from './is-demo-account.ts';

/**
 * Where a user is in signing in. Everyone needs a password and a code from
 * an authenticator app (two-step sign-in); the public demo account only
 * needs its password.
 *
 * - `password`: signed out.
 * - `verify-code`: password done, their authenticator app's code next.
 * - `set-up-app`: password done, but no authenticator app yet: they must
 *   add one before going further.
 * - `signed-in`: both steps done.
 */
export type SignInStep =
  'password' | 'verify-code' | 'set-up-app' | 'signed-in';

/**
 * The session's assurance level from its access token: `aal2` once a code
 * has been verified. The token isn't checked here; the database checks it
 * on every request. This only decides what the app shows.
 */
function readAssuranceLevel(accessToken: string): string | null {
  try {
    const payload = accessToken
      .split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(payload), (char) => char.charCodeAt(0));
    const claims: unknown = JSON.parse(new TextDecoder().decode(bytes));

    return typeof claims === 'object' && claims !== null && 'aal' in claims
      ? String(claims.aal)
      : null;
  } catch {
    return null;
  }
}

export function getSignInStep(session: Session | null): SignInStep {
  if (!session) return 'password';

  if (isDemoAccount(session.user)) return 'signed-in';

  if (readAssuranceLevel(session.access_token) === 'aal2') return 'signed-in';

  const hasApp = (session.user.factors ?? []).some(
    (factor) => factor.factor_type === 'totp' && factor.status === 'verified'
  );

  return hasApp ? 'verify-code' : 'set-up-app';
}
