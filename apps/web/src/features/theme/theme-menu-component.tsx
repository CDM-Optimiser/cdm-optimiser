import {DropdownComponent} from '@cdm-optimiser/ui/components/dropdown-component.tsx';
import {THEME_OPTIONS} from './theme-options.tsx';
import {useDesktopTheme} from './use-desktop-theme.ts';

/** The light/dark/system menu. Only the desktop app has one. */
export function ThemeMenuComponent() {
  const {isDesktop, theme, setTheme} = useDesktopTheme();

  if (!isDesktop) return null;

  return (
    <DropdownComponent
      options={THEME_OPTIONS}
      selectedValue={theme}
      onSelect={(value) => void setTheme(value)}
      labelPrefix="Theme"
    />
  );
}
