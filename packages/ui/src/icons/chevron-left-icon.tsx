import {SVGComponent} from '../components/svg-component.tsx';
import {outlineIconProps, type IconProps} from './icon-props.ts';

export function ChevronLeftIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M15 6l-6 6l6 6" />
    </SVGComponent>
  );
}
