import {getErrorMessage} from '../../lib/get-error-message.ts';
import {useAuth} from './use-auth.ts';

/**
 * Returns a function that signs the user out. The protected layout then
 * sends them to the login page, because the session is gone. If signing
 * out fails, the user stays signed in and can try again.
 */
export function useLogout() {
  const {logout} = useAuth();

  return () => {
    logout().catch((error: unknown) => {
      console.warn('Logout failed:', getErrorMessage(error));
    });
  };
}
