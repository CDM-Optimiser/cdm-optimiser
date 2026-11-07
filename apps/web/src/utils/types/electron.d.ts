import type {ThemeValue} from './theme.ts';

interface DarkModeApi {
  getThemeSource: () => Promise<ThemeValue>;
  set: (mode: ThemeValue) => Promise<boolean>;
  system: () => Promise<void>;
  toggle: () => Promise<boolean>;
}

interface IElectronAPI {
  loadPreferences: () => Promise<void>;
}

export declare global {
  interface Window {
    darkMode: DarkModeApi;
    electronAPI: IElectronAPI;
  }
}
