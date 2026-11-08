import {useActionState} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {TextFieldComponent} from '@cdm-optimiser/ui/components/text-field-component.tsx';
import {useAuth} from '../auth/use-auth.ts';
import {getTwoStepErrorMessage} from './get-two-step-error-message.ts';
import {verifySignInCode} from './two-step-api.ts';
import {CODE_FIELD} from './two-step-fields.ts';

/**
 * The second step of signing in: a code from one of the user's
 * authenticator apps. On success Supabase upgrades the session, and the
 * login page moves on by itself.
 */
export function VerifyCodeFormComponent() {
  const {user} = useAuth();
  const apps = (user?.factors ?? []).filter(
    (factor) => factor.factor_type === 'totp' && factor.status === 'verified'
  );

  const [error, formAction, isPending] = useActionState<
    string | null,
    FormData
  >(async (_previous, formData) => {
    try {
      await verifySignInCode(apps, String(formData.get('code') ?? ''));

      return null;
    } catch (caught) {
      return getTwoStepErrorMessage(caught);
    }
  }, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextFieldComponent
        label="Code from your authenticator app"
        hint="6 digits. It changes every 30 seconds."
        {...CODE_FIELD}
      />
      <ButtonComponent type="submit" disabled={isPending}>
        {isPending ? 'Checking…' : 'Continue'}
      </ButtonComponent>
      {error && (
        <AlertComponent type="error" title="Code not accepted" text={error} />
      )}
    </form>
  );
}
