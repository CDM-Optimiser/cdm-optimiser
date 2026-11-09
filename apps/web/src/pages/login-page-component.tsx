import type {ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import {getRedirectPath} from '../features/auth/get-redirect-path.ts';
import {LoginFormComponent} from '../features/auth/login-form-component.tsx';
import {useAuth} from '../features/auth/use-auth.ts';
import {useLogout} from '../features/auth/use-logout.ts';
import {BrandLogoComponent} from '../features/layout/brand-logo-component.tsx';
import {FooterComponent} from '../features/layout/footer-component.tsx';
import {SetUpAppComponent} from '../features/two-step/set-up-app-component.tsx';
import {VerifyCodeFormComponent} from '../features/two-step/verify-code-form-component.tsx';
import {APP_VERSION} from '../lib/app-version.ts';

/** Leaves a half-finished sign-in, back to the password step. */
function SwitchAccountButton() {
  const logout = useLogout();

  return (
    <ButtonComponent variant="secondary" onClick={logout}>
      Use a different account
    </ButtonComponent>
  );
}

function Step({title, children}: {title: string; children: ReactNode}) {
  return (
    <>
      <h1 className="text-center text-2xl font-bold">{title}</h1>
      {children}
    </>
  );
}

/**
 * Signing in, one step at a time: the password, then a code from the
 * user's authenticator app, or setting one up if they have none yet.
 * Once every step is done, it sends them where they were going.
 */
export function LoginPageComponent() {
  const {signInStep, loading} = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (signInStep === 'signed-in') {
    return <Navigate to={getRedirectPath(location.state)} replace />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
        <CardComponent className="flex flex-col gap-6 p-8">
          {/* Every step's heading names the app or the step, so the logo
              itself is decorative here. */}
          <BrandLogoComponent alt="" className="mx-auto h-12" />
          {signInStep === 'password' && (
            <Step title="Login to CDM Optimiser">
              <LoginFormComponent />
            </Step>
          )}
          {signInStep === 'verify-code' && (
            <Step title="Two-step sign-in">
              <p>
                Open your authenticator app and enter the code it shows for CDM
                Optimiser.
              </p>
              <VerifyCodeFormComponent />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You’ll stay signed in on this device until you log out, so you
                won’t need a code every time.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Lost your phone? Use another app you’ve added, or ask your
                practice’s administrator to reset two-step sign-in for your
                account.
              </p>
              <SwitchAccountButton />
            </Step>
          )}
          {signInStep === 'set-up-app' && (
            <Step title="Set up two-step sign-in">
              <p>
                To protect patient data, CDM Optimiser asks for a code from an
                authenticator app each time you sign in. Install one on your
                phone first, such as Google Authenticator or Microsoft
                Authenticator.
              </p>
              <SetUpAppComponent
                defaultName="Authenticator app"
                confirmLabel="Turn on two-step sign-in"
              />
              <SwitchAccountButton />
            </Step>
          )}
        </CardComponent>
      </main>
      <FooterComponent brand="CDM Optimiser" version={APP_VERSION} />
    </div>
  );
}
