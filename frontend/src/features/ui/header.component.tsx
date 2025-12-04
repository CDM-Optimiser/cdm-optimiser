import {NavLink} from 'react-router';
import {useAuth} from '../../utils/hooks/useAuth.tsx';
import {LogoutButton} from './logout-button.component.tsx';

interface HeaderProps {
  title: string;
}

export function HeaderComponent({title}: HeaderProps) {
  const {user} = useAuth();

  if (!user) return null;

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b-2 border-sky-400 p-4">
      <h1 className="text-3xl">{title}</h1>
      <nav className="flex items-center justify-between gap-6">
        {user && (
          <>
            <NavLink
              to="/"
              className={({isActive}) =>
                isActive
                  ? 'text-underline text-xl text-sky-700 underline transition duration-200 ease-in-out'
                  : 'text-underline text-xl text-sky-500 underline transition duration-200 ease-in-out hover:text-sky-700'
              }
            >
              Patients List
            </NavLink>
            <NavLink
              to="/pending-patients"
              className={({isActive}) =>
                isActive
                  ? 'text-underline text-xl text-sky-700 underline transition duration-200 ease-in-out'
                  : 'text-underline text-xl text-sky-500 underline transition duration-200 ease-in-out hover:text-sky-700'
              }
            >
              Pending Patients
            </NavLink>
          </>
        )}
        <LogoutButton />
      </nav>
    </header>
  );
}
