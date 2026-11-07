import type {ReactNode, SVGProps} from 'react';

interface SVGComponentProps extends SVGProps<SVGSVGElement> {
  height?: string;
  width?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  children: ReactNode;
}

export function SVGComponent({
  height = '24',
  width = '24',
  fill = 'currentColor',
  stroke = 'currentColor',
  strokeWidth = '1',
  className,
  children,
  ...props
}: SVGComponentProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}
