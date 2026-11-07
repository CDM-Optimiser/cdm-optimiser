import type {HTMLAttributes} from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  /** The element to render; pick the one that matches the content. */
  as?: 'div' | 'section' | 'article' | 'aside';
}

const SURFACE =
  'rounded-xl bg-white p-4 shadow-md dark:bg-white/5 dark:ring dark:ring-gray-600';

/**
 * The raised white surface used for panels across the app. `className` adds
 * layout (flex, gap, width); the surface itself stays the same everywhere.
 */
export function CardComponent({
  as: Element = 'div',
  className,
  ...props
}: CardProps) {
  return (
    <Element
      className={[SURFACE, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
