import {SVGComponent} from '../components/svg.component.tsx';
import {outlineIconProps, type IconProps} from './iconProps.ts';

export function CheckIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M5 12l5 5l10 -10" />
    </SVGComponent>
  );
}
