import { NavLink } from "react-router";

interface HeaderProps {
  title: string;
}

export function HeaderComponent({ title }: HeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b-2 border-sky-400 p-4">
      <h1 className="text-3xl">{title}</h1>
      <nav className="flex items-center justify-between gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-sky-700 text-underline transition duration-200 ease-in-out underline text-xl" : "text-xl underline text-sky-500 text-underline transition duration-200 ease-in-out hover:text-sky-700"
          }
        >
          Patients List
        </NavLink>
        <NavLink
          to="pending-patients"
          className={({ isActive }) =>
            isActive ? "text-sky-700 text-underline transition duration-200 ease-in-out underline text-xl" : "text-xl underline text-sky-500 text-underline transition duration-200 ease-in-out hover:text-sky-700"
          }
        >
          Pending Patients
        </NavLink>
      </nav>
    </header>
  );
}
