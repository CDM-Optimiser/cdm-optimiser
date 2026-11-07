import {app, BrowserWindow, ipcMain, nativeTheme} from 'electron/main';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set by `yarn dev:desktop` so the window loads the Vite dev server (HMR).
// Ignored in packaged builds, which always load the bundled renderer.
const devServerUrl = app.isPackaged
  ? undefined
  : process.env.VITE_DEV_SERVER_URL;

// DevTools open automatically in development. Packaged builds only open them
// when launched with `--devtools`, for debugging an installed app.
const shouldOpenDevTools =
  Boolean(devServerUrl) || process.argv.includes('--devtools');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, 'preload.cjs'),
    },
  });

  win.removeMenu();

  if (shouldOpenDevTools) {
    win.webContents.openDevTools();
  }

  if (devServerUrl) {
    win.loadURL(devServerUrl);
  } else {
    // `renderer/` holds the web build, copied in by `yarn build:renderer`.
    win.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

ipcMain.handle('dark-mode:get-source', () => {
  return nativeTheme.themeSource;
});

ipcMain.handle('dark-mode:set', (event, mode) => {
  nativeTheme.themeSource = mode;

  return true;
});

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system';
});

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  return nativeTheme.shouldUseDarkColors;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
