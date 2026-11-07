import {SVGComponent} from '../components/svg-component.tsx';
import {outlineIconProps, type IconProps} from './icon-props.ts';

export function XIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </SVGComponent>
  );
}
