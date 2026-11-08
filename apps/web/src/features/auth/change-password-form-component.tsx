import {useActionState} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {TextFieldComponent} from '@cdm-optimiser/ui/components/text-field-component.tsx';
import {getPasswordErrorMessage} from './get-password-error-message.ts';
import {MIN_PASSWORD_LENGTH} from './password-rules.ts';
import {useAuth} from './use-auth.ts';

type ChangePasswordState =
  {status: 'idle'} | {status: 'changed'} | {status: 'failed'; error: string};

const INITIAL_STATE: ChangePasswordState = {status: 'idle'};

/**
 * Changes the signed-in user's password. Supabase checks the current
 * password and the rules for the new one; the form only checks that the
 * two new passwords match. React clears the fields after each attempt, so
 * no password stays on screen.
 */
export function ChangePasswordFormComponent() {
  const {user, changePassword} = useAuth();

  const [state, formAction, isPending] = useActionState<
    ChangePasswordState,
    FormData
  >(async (_previous, formData) => {
    const currentPassword = String(formData.get('current-password') ?? '');
    const newPassword = String(formData.get('new-password') ?? '');
    const confirmation = String(formData.get('confirm-password') ?? '');

    if (newPassword !== confirmation) {
      return {status: 'failed', error: 'The new passwords don’t match.'};
    }

    try {
      await changePassword(currentPassword, newPassword);

      return {status: 'changed'};
    } catch (error) {
      return {status: 'failed', error: getPasswordErrorMessage(error)};
    }
  }, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Tells password managers which account the new password is for. */}
      <input
        type="email"
        name="username"
        autoComplete="username"
        value={user?.email ?? ''}
        readOnly
        hidden
      />
      <TextFieldComponent
        label="Current password"
        name="current-password"
        type="password"
        autoComplete="current-password"
        required
      />
      <TextFieldComponent
        label="New password"
        name="new-password"
        type="password"
        autoComplete="new-password"
        minLength={MIN_PASSWORD_LENGTH}
        hint={`At least ${MIN_PASSWORD_LENGTH} characters. A few unrelated words make a long password that’s easy to remember.`}
        required
      />
      <TextFieldComponent
        label="Confirm new password"
        name="confirm-password"
        type="password"
        autoComplete="new-password"
        minLength={MIN_PASSWORD_LENGTH}
        required
      />
      <ButtonComponent type="submit" disabled={isPending}>
        {isPending ? 'Changing password…' : 'Change password'}
      </ButtonComponent>
      {state.status === 'failed' && (
        <AlertComponent
          type="error"
          title="Password not changed"
          text={state.error}
        />
      )}
      {state.status === 'changed' && (
        <AlertComponent
          type="success"
          title="Password changed"
          text="Use your new password next time you sign in. You’ve been signed out on your other devices."
        />
      )}
    </form>
  );
}
