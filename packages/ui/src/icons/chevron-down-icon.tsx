import {SVGComponent} from '../components/svg-component.tsx';
import {outlineIconProps, type IconProps} from './icon-props.ts';

/** Points down: a button that opens a list under it. */
export function ChevronDownIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M6 9l6 6l6 -6" />
    </SVGComponent>
  );
}
