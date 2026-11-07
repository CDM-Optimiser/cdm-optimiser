import {useActionState} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {TextFieldComponent} from '@cdm-optimiser/ui/components/text-field-component.tsx';
import {getErrorMessage} from '../../lib/get-error-message.ts';
import {useAuth} from './use-auth.ts';

interface LoginState {
  error: string | null;
  /** Put back in the field: React clears the form after each submit. */
  email: string;
}

const INITIAL_STATE: LoginState = {error: null, email: ''};

/**
 * Email and password sign-in. On success the session changes and the login
 * page redirects; on failure Supabase's message is shown once.
 */
export function LoginFormComponent() {
  const {login} = useAuth();

  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    async (_previous, formData) => {
      const email = String(formData.get('email') ?? '');
      const password = String(formData.get('password') ?? '');

      try {
        await login(email, password);

        return {error: null, email};
      } catch (error) {
        return {error: getErrorMessage(error), email};
      }
    },
    INITIAL_STATE
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextFieldComponent
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.email}
        required
      />
      <TextFieldComponent
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <ButtonComponent type="submit" disabled={isPending}>
        {isPending ? 'Logging in…' : 'Login'}
      </ButtonComponent>
      {state.error && (
        <AlertComponent type="error" title="Login failed" text={state.error} />
      )}
    </form>
  );
}
