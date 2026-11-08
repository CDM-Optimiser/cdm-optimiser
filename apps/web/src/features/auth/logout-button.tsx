import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {useLogout} from './use-logout.ts';

/** Signs the user out (the Account page has one). */
export function LogoutButton({className}: {className?: string}) {
  const logout = useLogout();

  return (
    <ButtonComponent className={className} onClick={logout}>
      Logout
    </ButtonComponent>
  );
}
