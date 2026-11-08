import type {ReactNode} from 'react';
import {NavLink} from 'react-router';

interface NavItemProps {
  to: string;
  children: ReactNode;
}

/**
 * A link in the header's navigation. NavLink marks the current page with
 * `aria-current="page"`, which also makes it bold, so the current page
 * doesn't rely on colour alone.
 */
export function NavItemComponent({to, children}: NavItemProps) {
  return (
    <NavLink
      to={to}
      className="text-xl text-sky-700 underline transition duration-200 ease-in-out hover:text-sky-900 aria-[current=page]:font-semibold dark:text-sky-300 dark:hover:text-sky-200"
    >
      {children}
    </NavLink>
  );
}
