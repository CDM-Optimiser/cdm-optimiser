// Presentational building blocks shared by the CDM Optimiser apps.
// Keep this package free of Supabase, routing and app state: components get
// everything they need through props.

// Components
export {AlertComponent} from './components/alert.component.tsx';
export {
  ButtonComponent,
  type ButtonVariant,
} from './components/button.component.tsx';
export {CardComponent} from './components/card.component.tsx';
export {
  DropdownComponent,
  type DropdownItem,
} from './components/dropdown.component.tsx';
export {FooterComponent} from './components/footer.component.tsx';
export {ModalComponent} from './components/modal.component.tsx';
export {SVGComponent} from './components/svg.component.tsx';
export {
  SwitchComponent,
  type SwitchTone,
} from './components/switch.component.tsx';
export {TextFieldComponent} from './components/text-field.component.tsx';

// Hooks and types
export {useAutoDismiss} from './hooks/useAutoDismiss.ts';
export type {AlertTypes} from './types/alert.ts';

// Icons (Tabler Icons, MIT). Decorative by default: see icons/iconProps.ts.
export type {IconProps} from './icons/iconProps.ts';
export {AlertCircleFilledIcon} from './icons/alert-circle-filled.icon.tsx';
export {AlertTriangleFilledIcon} from './icons/alert-triangle-filled.icon.tsx';
export {CheckIcon} from './icons/check.icon.tsx';
export {ChevronLeftIcon} from './icons/chevron-left.icon.tsx';
export {ChevronRightIcon} from './icons/chevron-right.icon.tsx';
export {CircleCheckFilledIcon} from './icons/circle-check-filled.icon.tsx';
export {DeviceDesktopIcon} from './icons/device-desktop.icon.tsx';
export {DotsIcon} from './icons/dots.icon.tsx';
export {InfoCircleFilledIcon} from './icons/info-circle-filled.icon.tsx';
export {MoonFilledIcon} from './icons/moon-filled.icon.tsx';
export {SearchIcon} from './icons/search.icon.tsx';
export {SquareIcon} from './icons/square.icon.tsx';
export {SquareCheckFilledIcon} from './icons/square-check-filled.icon.tsx';
export {SquareFilledIcon} from './icons/square-filled.icon.tsx';
export {SquareXIcon} from './icons/square-x.icon.tsx';
export {SquareXFilledIcon} from './icons/square-x-filled.icon.tsx';
export {SunIcon} from './icons/sun.icon.tsx';
export {XIcon} from './icons/x.icon.tsx';
