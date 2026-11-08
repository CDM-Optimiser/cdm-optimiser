// Runs in the sandboxed renderer before the web app loads. A sandboxed preload
// can only require() a few Electron modules, and the compiled file must stay a
// plain script: no `import` statements, so TypeScript emits no `exports`
// boilerplate. The shared contract is therefore referenced through inline
// `import()` types, which compile away completely (see moduleDetection in
// ../tsconfig.json).

type DarkModeApi = import('@cdm-optimiser/desktop-bridge').DarkModeApi;
type AppUpdatesApi = import('@cdm-optimiser/desktop-bridge').AppUpdatesApi;
type UpdateStatus = import('@cdm-optimiser/desktop-bridge').UpdateStatus;
type DesktopIpcChannel =
  import('@cdm-optimiser/desktop-bridge').DesktopIpcChannel;
type DesktopIpcChannels =
  import('@cdm-optimiser/desktop-bridge').DesktopIpcChannels;

const {
  contextBridge,
  ipcRenderer,
}: typeof import('electron/renderer') = require('electron/renderer');

/** Calls a main-process handler from the shared IPC contract. */
function invoke<Channel extends DesktopIpcChannel>(
  channel: Channel,
  ...args: DesktopIpcChannels[Channel]['args']
): Promise<DesktopIpcChannels[Channel]['result']> {
  return ipcRenderer.invoke(channel, ...args);
}

const darkMode: DarkModeApi = {
  getThemeSource: () => invoke('dark-mode:get-source'),
  set: (mode) => invoke('dark-mode:set', mode),
  system: () => invoke('dark-mode:system'),
};

contextBridge.exposeInMainWorld('darkMode', darkMode);

const appUpdates: AppUpdatesApi = {
  getStatus: () => invoke('updates:get-status'),
  install: () => invoke('updates:install'),
  // Only the status is passed on, never the IPC event itself.
  onStatus: (listener) => {
    const handler = (_event: unknown, status: UpdateStatus) => listener(status);

    ipcRenderer.on('updates:status', handler);

    return () => {
      ipcRenderer.removeListener('updates:status', handler);
    };
  },
};

contextBridge.exposeInMainWorld('appUpdates', appUpdates);
