interface HeaderProps {
  title: string;
}

export function HeaderComponent({title}: HeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b-2 border-sky-400 p-4">
      <h1 className="text-3xl">{title}</h1>
      <nav className="flex items-center justify-between gap-6">
        <a
          href="/"
          title="Patients list"
          className="text-xl text-sky-500 underline transition duration-200 ease-in-out hover:text-sky-700"
        >
          Patients list
        </a>
        <a
          href="/patients-cards"
          title="Patients cards"
          className="text-xl text-sky-500 underline transition duration-200 ease-in-out hover:text-sky-700"
        >
          Patients cards
        </a>
      </nav>
    </header>
  );
}
