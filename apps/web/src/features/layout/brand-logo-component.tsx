interface BrandLogoProps {
  /**
   * The image's text alternative: the app's name where the logo names it
   * (the header link), or empty where a heading next to it already does.
   */
  alt: string;
  /** Size and placement; the logo keeps its proportions (about 3.85:1). */
  className?: string;
}

/**
 * The CDM Optimiser logo: the "CDM" tile followed by "Optimiser". The dark
 * version has a white wordmark and a lighter tile. It follows dark mode
 * (the operating system's, or the desktop theme menu's), like the page.
 */
export function BrandLogoComponent({alt, className}: BrandLogoProps) {
  return (
    <picture>
      <source srcSet="/logo-dark.svg" media="(prefers-color-scheme: dark)" />
      <img
        src="/logo.svg"
        alt={alt}
        width={154}
        height={40}
        className={['block w-auto', className].filter(Boolean).join(' ')}
      />
    </picture>
  );
}
