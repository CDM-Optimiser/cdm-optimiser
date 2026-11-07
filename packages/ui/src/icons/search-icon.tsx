import {SVGComponent} from '../components/svg-component.tsx';
import {outlineIconProps, type IconProps} from './icon-props.ts';

export function SearchIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
      <path d="M21 21l-6 -6" />
    </SVGComponent>
  );
}
