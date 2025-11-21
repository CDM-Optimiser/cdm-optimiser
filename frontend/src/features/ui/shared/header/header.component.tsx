interface HeaderProps {
  title: string;
}

export function HeaderComponent({ title }: HeaderProps) {
  return (
    <header className="border-b-2 border-sky-400 flex justify-center mx-auto my-0 py-4">
      <h1 className="text-3xl">{title}</h1>
    </header>
  );
}
