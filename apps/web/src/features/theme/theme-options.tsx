import type {DropdownItem} from '@cdm-optimiser/ui/components/dropdown-component.tsx';
import {DeviceDesktopIcon} from '@cdm-optimiser/ui/icons/device-desktop-icon.tsx';
import {MoonFilledIcon} from '@cdm-optimiser/ui/icons/moon-filled-icon.tsx';
import {SunIcon} from '@cdm-optimiser/ui/icons/sun-icon.tsx';
import type {ThemeValue} from '@cdm-optimiser/desktop-bridge';

/** The desktop theme menu's choices, in order. */
export const THEME_OPTIONS: DropdownItem<ThemeValue>[] = [
  {label: 'System', value: 'system', icon: <DeviceDesktopIcon />},
  {label: 'Light', value: 'light', icon: <SunIcon />},
  {label: 'Dark', value: 'dark', icon: <MoonFilledIcon />},
];
