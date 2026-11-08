import type {ThemeValue} from '@cdm-optimiser/desktop-bridge';

const THEME_VALUES: readonly ThemeValue[] = ['system', 'light', 'dark'];

/** Whether a value from the desktop app is a theme the menu knows. */
export function isThemeValue(value: unknown): value is ThemeValue {
  return THEME_VALUES.some((theme) => theme === value);
}
