import {SVGComponent} from '../components/svg.component.tsx';
import {outlineIconProps, type IconProps} from './iconProps.ts';

export function ChevronRightIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M9 6l6 6l-6 6" />
    </SVGComponent>
  );
}
