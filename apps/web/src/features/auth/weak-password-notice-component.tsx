import {Link, useLocation} from 'react-router';
import type {WeakPasswordReasons} from '@supabase/supabase-js';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {isDemoAccount} from './is-demo-account.ts';
import {MIN_PASSWORD_LENGTH} from './password-rules.ts';
import {useAuth} from './use-auth.ts';

const REASONS: Record<WeakPasswordReasons, string> = {
  length: `It’s shorter than ${MIN_PASSWORD_LENGTH} characters.`,
  pwned: 'It has appeared in a data leak, so attackers may try it.',
  characters: 'It’s missing a required type of character.',
};

/**
 * Asks the user to change a password that Supabase flagged at sign-in. It
 * stays until they change it, dismiss it or sign out. Not shown on the
 * Account page, which has the form, nor for the demo account, whose
 * password can't be changed.
 */
export function WeakPasswordNoticeComponent() {
  const {user, weakPassword, dismissWeakPassword} = useAuth();
  const {pathname} = useLocation();

  if (!weakPassword || isDemoAccount(user) || pathname === '/account') {
    return null;
  }

  const reasons = weakPassword.reasons.map((reason) => REASONS[reason]);

  return (
    <AlertComponent
      type="warning"
      title="Your password needs changing"
      text={[
        ...reasons,
        'You can still sign in with it, but please change it now.',
      ].join(' ')}
      onDismiss={dismissWeakPassword}
    >
      <Link
        to="/account"
        className="text-sky-700 underline transition duration-200 ease-in-out hover:text-sky-900"
      >
        Change your password
      </Link>
    </AlertComponent>
  );
}
