import {Link} from 'react-router';
import {LogoutButton} from '../auth/logout-button.tsx';
import {ThemeMenuComponent} from '../theme/theme-menu-component.tsx';
import {NavItemComponent} from './nav-item-component.tsx';

const NAV_ITEMS: readonly {to: string; label: string}[] = [
  {to: '/', label: 'Patients List'},
  {to: '/pending-patients', label: 'Pending Patients'},
];

interface HeaderProps {
  /** The app's name, linking to the patients list. */
  title: string;
}

/**
 * The top of every signed-in page (ProtectedLayout only renders it for a
 * signed-in user). The brand is a link, not a heading: each page has its own
 * `h1`.
 */
export function HeaderComponent({title}: HeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b-2 border-sky-400 px-6 py-4">
      <Link to="/" className="text-3xl">
        {title}
      </Link>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV_ITEMS.map(({to, label}) => (
              <li key={to}>
                <NavItemComponent to={to}>{label}</NavItemComponent>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <LogoutButton />
          <ThemeMenuComponent />
        </div>
      </div>
    </header>
  );
}
