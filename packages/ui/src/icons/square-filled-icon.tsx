import {SVGComponent} from '../components/svg-component.tsx';
import {filledIconProps, type IconProps} from './icon-props.ts';

export function SquareFilledIcon(props: IconProps) {
  return (
    <SVGComponent {...filledIconProps} {...props}>
      <path d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3z" />
    </SVGComponent>
  );
}
