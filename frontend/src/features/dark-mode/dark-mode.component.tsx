import {useCallback, useEffect, useState} from 'react';
import {setElectronTheme} from '../../utils/functions/setElectronTheme.ts';
import {
  type DropdownItem,
  DropdownComponent,
} from '../ui/dropdown.component.tsx';
import type {ThemeValue} from '../../utils/types/theme.ts';
import {SVGComponent} from '../ui/svg.component.tsx';
import {getErrorMessage} from '../../utils/functions/getErrorMessage.ts';

const themeOptions: DropdownItem<ThemeValue>[] = [
  {
    label: 'System',
    value: 'system',
    icon: (
      <SVGComponent fill="none">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z" />
        <path d="M7 20h10" />
        <path d="M9 16v4" />
        <path d="M15 16v4" />
      </SVGComponent>
    ),
  },
  {
    label: 'Light',
    value: 'light',
    icon: (
      <SVGComponent>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M12 5l0 -2" />
        <path d="M17 7l1.4 -1.4" />
        <path d="M19 12l2 0" />
        <path d="M17 17l1.4 1.4" />
        <path d="M12 19l0 2" />
        <path d="M7 17l-1.4 1.4" />
        <path d="M6 12l-2 0" />
        <path d="M7 7l-1.4 -1.4" />
      </SVGComponent>
    ),
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: (
      <SVGComponent>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" />
      </SVGComponent>
    ),
  },
];

export const DarkModeComponent = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeValue>('system');

  const handleThemeChange = useCallback(async (theme: ThemeValue) => {
    setSelectedTheme(theme);

    await setElectronTheme(theme);
  }, []);

  const isElectron = typeof window.darkMode !== 'undefined';

  useEffect(() => {
    if (isElectron && window.darkMode.getThemeSource) {
      window.darkMode
        .getThemeSource()
        .then((initialTheme: ThemeValue) => {
          if (
            ['system', 'light', 'dark'].includes(initialTheme as ThemeValue)
          ) {
            setSelectedTheme(initialTheme as ThemeValue);
          }
        })
        .catch((error) => {
          getErrorMessage(error);
        });
    }
  }, [isElectron]);

  if (!isElectron) return null;

  return (
    <DropdownComponent
      options={themeOptions}
      selectedValue={selectedTheme}
      onSelect={handleThemeChange}
      labelPrefix="Theme"
    />
  );
};
