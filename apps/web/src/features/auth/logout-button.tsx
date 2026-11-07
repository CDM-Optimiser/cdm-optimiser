import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {getErrorMessage} from '../../lib/get-error-message.ts';
import {useAuth} from './use-auth.ts';

/**
 * Signs the user out. The protected layout then sends them to the login
 * page, because the session is gone.
 */
export function LogoutButton() {
  const {logout} = useAuth();

  const handleLogout = () => {
    logout().catch((error: unknown) => {
      // The user stays signed in and can try again.
      console.warn('Logout failed:', getErrorMessage(error));
    });
  };

  return <ButtonComponent onClick={handleLogout}>Logout</ButtonComponent>;
}
