import type {ReactNode, SVGProps} from 'react';

interface SVGComponentProps extends SVGProps<SVGSVGElement> {
  children: ReactNode;
}

/** A 24×24 SVG canvas, coloured with `currentColor`. The icons build on it. */
export function SVGComponent({
  height = 24,
  width = 24,
  viewBox = '0 0 24 24',
  fill = 'currentColor',
  stroke = 'currentColor',
  strokeWidth = 1,
  children,
  ...props
}: SVGComponentProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...props}
    >
      {children}
    </svg>
  );
}
