// The contract between the Electron main process, the preload script and the
// web app. Types only: nothing here exists at runtime, so the sandboxed
// preload script can use it without importing any module.
//
// To add or change an IPC call, update `DesktopIpcChannels` and `DarkModeApi`
// here, then the handler in apps/desktop/src/main.ts and the bridge in
// apps/desktop/src/preload.cts. The compiler flags any mismatch.

export type ThemeValue = 'system' | 'light' | 'dark';

/** Exposed to the renderer as `window.darkMode` by the preload script. */
export interface DarkModeApi {
  getThemeSource: () => Promise<ThemeValue>;
  set: (mode: ThemeValue) => Promise<boolean>;
  system: () => Promise<void>;
}

/**
 * IPC channels handled by the main process with `ipcMain.handle`, and called
 * by the preload script with `ipcRenderer.invoke`: the arguments the renderer
 * sends and the value the main process returns.
 */
export interface DesktopIpcChannels {
  'dark-mode:get-source': {args: []; result: ThemeValue};
  'dark-mode:set': {args: [mode: ThemeValue]; result: boolean};
  'dark-mode:system': {args: []; result: void};
}

export type DesktopIpcChannel = keyof DesktopIpcChannels;

declare global {
  interface Window {
    /**
     * Only in the desktop app. A plain browser has no `darkMode`, so check
     * for it before use.
     */
    darkMode?: DarkModeApi;
  }
}
