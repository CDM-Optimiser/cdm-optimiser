import {useId} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import {ChangePasswordFormComponent} from '../features/auth/change-password-form-component.tsx';
import {isDemoAccount} from '../features/auth/is-demo-account.ts';
import {LogoutButton} from '../features/auth/logout-button.tsx';
import {useAuth} from '../features/auth/use-auth.ts';

const SECTION = 'flex flex-col gap-6 p-6';

/** The signed-in user's account: who they are, Logout, and their password. */
export function AccountPageComponent() {
  const {user} = useAuth();
  const signedInId = useId();
  const passwordId = useId();

  return (
    <>
      <h1 className="text-2xl font-semibold">Account</h1>
      {/* Two columns on wide screens, each card as tall as its content;
          one column below `lg`. */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <CardComponent
          as="section"
          aria-labelledby={signedInId}
          className={SECTION}
        >
          <h2 id={signedInId} className="text-xl font-semibold">
            Signed in
          </h2>
          <p className="break-words">
            You’re signed in as <strong>{user?.email}</strong>.
          </p>
          <LogoutButton className="self-start" />
        </CardComponent>
        <CardComponent
          as="section"
          aria-labelledby={passwordId}
          className={SECTION}
        >
          <h2 id={passwordId} className="text-xl font-semibold">
            Change password
          </h2>
          {isDemoAccount(user) ? (
            <AlertComponent
              type="info"
              title="This is the demo account"
              text="Everyone trying the app shares its password, so it can’t be changed."
            />
          ) : (
            <ChangePasswordFormComponent />
          )}
        </CardComponent>
      </div>
    </>
  );
}
