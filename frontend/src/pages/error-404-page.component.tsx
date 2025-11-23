export function Error404PageComponent() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 py-6">
      <h1 className="text-5xl">404</h1>
      <h2 className="text-4xl">Página no encontrada</h2>
      <p className="text-xl">La página que buscas no existe.</p>
      <a
        href="/"
        className="text-sky-500 underline transition duration-200 ease-in-out hover:text-sky-700"
      >
        Volver al inicio
      </a>
    </main>
  );
}
