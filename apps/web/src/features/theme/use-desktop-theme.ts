import {useEffect, useState} from 'react';
import type {ThemeValue} from '@cdm-optimiser/desktop-bridge';
import {getErrorMessage} from '../../lib/get-error-message.ts';
import {isThemeValue} from './is-theme-value.ts';

/**
 * The desktop app's theme (system, light or dark), read from and sent to the
 * Electron main process through `window.darkMode`. In a plain browser there
 * is no `window.darkMode`: `isDesktop` is false and the theme follows the
 * operating system.
 */
export function useDesktopTheme() {
  const darkMode = window.darkMode;
  const [theme, setThemeState] = useState<ThemeValue>('system');

  useEffect(() => {
    if (!darkMode) return;

    let cancelled = false;

    darkMode
      .getThemeSource()
      .then((source) => {
        if (!cancelled && isThemeValue(source)) setThemeState(source);
      })
      .catch((error: unknown) => {
        console.warn('Could not read the theme:', getErrorMessage(error));
      });

    return () => {
      cancelled = true;
    };
  }, [darkMode]);

  const setTheme = async (next: ThemeValue) => {
    if (!darkMode) return;

    setThemeState(next);

    try {
      await darkMode.set(next);
    } catch (error) {
      // Fall back to the operating system's theme, and show that.
      console.warn('Could not change the theme:', getErrorMessage(error));
      setThemeState('system');
      await darkMode.system().catch(() => {});
    }
  };

  return {isDesktop: darkMode !== undefined, theme, setTheme};
}
