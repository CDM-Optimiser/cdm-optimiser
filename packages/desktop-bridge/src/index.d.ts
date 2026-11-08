// The contract between the Electron main process, the preload script and the
// web app. Types only: nothing here exists at runtime, so the sandboxed
// preload script can use it without importing any module.
//
// To add or change an IPC call, update `DesktopIpcChannels` (or
// `DesktopIpcEvents`) and the API interface here, then the handler in
// apps/desktop/src (main.ts, updater.ts) and the bridge in preload.cts. The
// compiler flags any mismatch.

export type ThemeValue = 'system' | 'light' | 'dark';

/** Exposed to the renderer as `window.darkMode` by the preload script. */
export interface DarkModeApi {
  getThemeSource: () => Promise<ThemeValue>;
  set: (mode: ThemeValue) => Promise<boolean>;
  system: () => Promise<void>;
}

/**
 * Where the desktop app's update stands. Updates download in the background;
 * once one is `ready`, the user can restart to install it (or it installs
 * the next time the app quits).
 */
export type UpdateStatus =
  | {state: 'idle'}
  | {state: 'downloading'; version: string}
  | {state: 'ready'; version: string};

/** Exposed to the renderer as `window.appUpdates` by the preload script. */
export interface AppUpdatesApi {
  /** The current status, for a page that has just loaded. */
  getStatus: () => Promise<UpdateStatus>;
  /** Calls `listener` on every change; returns a function that stops it. */
  onStatus: (listener: (status: UpdateStatus) => void) => () => void;
  /** Restarts the app and installs a `ready` update; does nothing otherwise. */
  install: () => Promise<void>;
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
  'updates:get-status': {args: []; result: UpdateStatus};
  'updates:install': {args: []; result: void};
}

/**
 * Events the main process sends to the renderer with `webContents.send`,
 * and the payload of each.
 */
export interface DesktopIpcEvents {
  'updates:status': UpdateStatus;
}

export type DesktopIpcEvent = keyof DesktopIpcEvents;

export type DesktopIpcChannel = keyof DesktopIpcChannels;

declare global {
  interface Window {
    /**
     * Only in the desktop app. A plain browser has no `darkMode`, so check
     * for it before use.
     */
    darkMode?: DarkModeApi;
    /** Only in the desktop app, like `darkMode`. */
    appUpdates?: AppUpdatesApi;
  }
}
