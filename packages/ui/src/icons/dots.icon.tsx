import {SVGComponent} from '../components/svg.component.tsx';
import {outlineIconProps, type IconProps} from './iconProps.ts';

export function DotsIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M5 12h2" />
      <path d="M11 12h2" />
      <path d="M17 12h2" />
    </SVGComponent>
  );
}
