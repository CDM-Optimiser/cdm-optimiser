interface FooterProps {
  brand: string;
  /** The app's version, so staff can tell support which one they run. */
  version: string;
}

export function FooterComponent({brand, version}: FooterProps) {
  // Read on every render, not once when the module loads, so a desktop app
  // left open over New Year shows the right year.
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto my-0 flex w-full max-w-7xl flex-wrap justify-center gap-x-2 border-t border-gray-300 p-4 dark:border-gray-600">
      <span>
        &copy; {year} {brand}
      </span>
      <span aria-hidden="true">·</span>
      <span>Version {version}</span>
    </footer>
  );
}
