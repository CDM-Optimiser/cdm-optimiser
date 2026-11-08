import {SVGComponent} from '../components/svg-component.tsx';
import {outlineIconProps, type IconProps} from './icon-props.ts';

/** A funnel: the button that opens the filters on small screens. */
export function FilterIcon(props: IconProps) {
  return (
    <SVGComponent {...outlineIconProps} {...props}>
      <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
    </SVGComponent>
  );
}
