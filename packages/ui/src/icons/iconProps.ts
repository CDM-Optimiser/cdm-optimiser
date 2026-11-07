import type {SVGProps} from 'react';

/**
 * Props every icon accepts. Icons are decorative by default (`aria-hidden`):
 * give the control that contains them an accessible name instead. Pass
 * `aria-hidden={false}` and `aria-label` only for an icon that stands alone
 * and carries meaning.
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'>;

/** Solid shapes, coloured with `text-*` classes. */
export const filledIconProps = {
  fill: 'currentColor',
  stroke: 'none',
  'aria-hidden': true,
} satisfies IconProps;

/** Line drawings, coloured with `text-*` classes. */
export const outlineIconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} satisfies IconProps;
