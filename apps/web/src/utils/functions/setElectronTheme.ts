import type {ThemeValue} from '@cdm-optimiser/desktop-bridge';
import {getErrorMessage} from './getErrorMessage.ts';

export const setElectronTheme = async (theme: ThemeValue) => {
  try {
    await window.darkMode.set(theme as ThemeValue);

    return theme;
  } catch (error) {
    getErrorMessage(error);

    if (typeof window.darkMode.system === 'function') {
      await window.darkMode.system();
    }

    return 'system';
  }
};
