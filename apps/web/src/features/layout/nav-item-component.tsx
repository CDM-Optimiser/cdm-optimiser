import type {ReactNode} from 'react';
import {NavLink} from 'react-router';

interface NavItemProps {
  to: string;
  children: ReactNode;
}

/**
 * A link in the header's navigation. NavLink marks the current page with
 * `aria-current="page"`, which also picks the darker colour.
 */
export function NavItemComponent({to, children}: NavItemProps) {
  return (
    <NavLink
      to={to}
      className="text-xl text-sky-500 underline transition duration-200 ease-in-out hover:text-sky-700 aria-[current=page]:text-sky-700"
    >
      {children}
    </NavLink>
  );
}
