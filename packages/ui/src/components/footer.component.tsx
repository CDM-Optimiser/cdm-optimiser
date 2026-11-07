interface FooterProps {
  brand: string;
  copyright?: string;
}

export function FooterComponent({brand, copyright}: FooterProps) {
  // Read on every render, not once when the module loads, so a desktop app
  // left open over New Year shows the right year.
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto my-0 flex w-full max-w-7xl justify-center gap-2 border-t border-gray-300 p-4">
      <span>&copy;</span>
      <span>{year}</span>
      <span>{brand}</span>
      {copyright && <span> - {copyright}</span>}
    </footer>
  );
}
