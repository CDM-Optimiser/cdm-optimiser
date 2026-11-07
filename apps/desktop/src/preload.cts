// Runs in the sandboxed renderer before the web app loads. Sandboxed preload
// scripts are CommonJS and can only require() a few Electron modules, so the
// shared contract is imported as types only: it compiles away completely.

import type {
  DarkModeApi,
  DesktopIpcChannel,
  DesktopIpcChannels,
} from '@cdm-optimiser/desktop-bridge';

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
  toggle: () => invoke('dark-mode:toggle'),
};

contextBridge.exposeInMainWorld('darkMode', darkMode);
