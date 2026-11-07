import {SVGComponent} from '../components/svg-component.tsx';
import {outlineIconProps, type IconProps} from './icon-props.ts';

export function SquareIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
    </SVGComponent>
  );
}
