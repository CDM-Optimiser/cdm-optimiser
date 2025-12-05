interface FooterProps {
  brand: string;
  copyright?: string;
}

const date = new Date().getFullYear();

export function FooterComponent({brand, copyright}: FooterProps) {
  return (
    <footer className="mx-auto my-0 flex w-full max-w-7xl justify-center gap-2 border-t border-gray-300 p-4">
      <span>&copy;</span>
      <span>{date}</span>
      <span>{brand}</span>
      {copyright && <span> - {copyright}</span>}
    </footer>
  );
}
