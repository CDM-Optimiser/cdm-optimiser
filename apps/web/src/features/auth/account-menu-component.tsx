import {NavLink} from 'react-router';
import {MenuButtonComponent} from '@cdm-optimiser/ui/components/menu-button-component.tsx';
import {LogoutIcon} from '@cdm-optimiser/ui/icons/logout-icon.tsx';
import {UserCircleIcon} from '@cdm-optimiser/ui/icons/user-circle-icon.tsx';
import {useAuth} from './use-auth.ts';
import {useLogout} from './use-logout.ts';

interface AccountMenuProps {
  /** `end` in the header bar, at the right edge of the screen. */
  align?: 'start' | 'end';
  /** Layout for the menu, such as `w-full` in the drawer. */
  className?: string;
  /** Called when Account is chosen, so the menu drawer can close. */
  onNavigate?: () => void;
}

/**
 * The signed-in user, an avatar and their email, as a button that opens
 * Account and Logout. Only rendered on signed-in pages, so a missing user
 * shows nothing.
 */
export function AccountMenuComponent({
  align,
  className,
  onNavigate,
}: AccountMenuProps) {
  const {user} = useAuth();
  const logout = useLogout();

  if (!user?.email) return null;

  return (
    <MenuButtonComponent
      label={`Account: ${user.email}`}
      align={align}
      className={className}
      trigger={
        <>
          <UserCircleIcon width={24} height={24} className="shrink-0" />
          <span className="truncate" title={user.email}>
            {user.email}
          </span>
        </>
      }
      items={[
        {
          label: 'Account',
          icon: <UserCircleIcon />,
          renderLink: (props) => (
            <NavLink to="/account" onClick={onNavigate} {...props} />
          ),
        },
        {label: 'Logout', icon: <LogoutIcon />, onSelect: logout},
      ]}
    />
  );
}
