const {contextBridge, ipcRenderer} = require('electron/renderer');

contextBridge.exposeInMainWorld('darkMode', {
  getThemeSource: () => ipcRenderer.invoke('dark-mode:get-source'),
  set: (mode) => ipcRenderer.invoke('dark-mode:set', mode),
  system: () => ipcRenderer.invoke('dark-mode:system'),
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
});
