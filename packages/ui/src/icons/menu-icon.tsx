import {SVGComponent} from '../components/svg-component.tsx';
import {outlineIconProps, type IconProps} from './icon-props.ts';

/** Three lines: the button that opens the menu on small screens. */
export function MenuIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M4 6l16 0" />
      <path d="M4 12l16 0" />
      <path d="M4 18l16 0" />
    </SVGComponent>
  );
}
