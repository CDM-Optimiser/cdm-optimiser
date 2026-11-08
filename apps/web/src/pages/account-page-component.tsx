import {useId, type ReactNode} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import {ChangePasswordFormComponent} from '../features/auth/change-password-form-component.tsx';
import {isDemoAccount} from '../features/auth/is-demo-account.ts';
import {LogoutButton} from '../features/auth/logout-button.tsx';
import {useAuth} from '../features/auth/use-auth.ts';
import {AuthenticatorAppsComponent} from '../features/two-step/authenticator-apps-component.tsx';

/** A card with its own heading, named by it for screen readers. */
function Section({title, children}: {title: string; children: ReactNode}) {
  const headingId = useId();

  return (
    <CardComponent
      as="section"
      aria-labelledby={headingId}
      className="flex flex-col gap-6 p-6"
    >
      <h2 id={headingId} className="text-xl font-semibold">
        {title}
      </h2>
      {children}
    </CardComponent>
  );
}

/**
 * The signed-in user's account: who they are and Logout, their
 * authenticator apps, and their password.
 */
export function AccountPageComponent() {
  const {user} = useAuth();

  return (
    <>
      <h1 className="text-2xl font-semibold">Account</h1>
      {/* Two columns on wide screens, each card as tall as its content;
          one column below `lg`. */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Section title="Signed in">
            <p className="break-words">
              You’re signed in as <strong>{user?.email}</strong>.
            </p>
            <LogoutButton className="self-start" />
          </Section>
          <Section title="Two-step sign-in">
            <AuthenticatorAppsComponent />
          </Section>
        </div>
        <Section title="Change password">
          {isDemoAccount(user) ? (
            <AlertComponent
              type="info"
              title="This is the demo account"
              text="Everyone trying the app shares its password, so it can’t be changed."
            />
          ) : (
            <ChangePasswordFormComponent />
          )}
        </Section>
      </div>
    </>
  );
}
