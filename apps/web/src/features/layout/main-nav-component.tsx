import {NavItemComponent} from './nav-item-component.tsx';

const NAV_ITEMS: readonly {to: string; label: string}[] = [
  {to: '/', label: 'Patients List'},
  {to: '/pending-patients', label: 'Pending Patients'},
];

interface MainNavProps {
  /** A row in the header bar, or a column in the menu drawer. */
  orientation?: 'horizontal' | 'vertical';
  /** Called when a link is chosen, so the drawer can close. */
  onNavigate?: () => void;
}

/**
 * The app's main navigation. The header shows it in the bar on wide
 * screens and in the drawer on small ones, never both at once, so there's
 * only ever one "Main" navigation on the page.
 */
export function MainNavComponent({
  orientation = 'horizontal',
  onNavigate,
}: MainNavProps) {
  return (
    <nav aria-label="Main">
      <ul
        className={
          orientation === 'horizontal'
            ? 'flex flex-wrap items-center gap-x-6 gap-y-2'
            : 'flex flex-col gap-4'
        }
      >
        {NAV_ITEMS.map(({to, label}) => (
          <li key={to}>
            <NavItemComponent to={to} onClick={onNavigate}>
              {label}
            </NavItemComponent>
          </li>
        ))}
      </ul>
    </nav>
  );
}
