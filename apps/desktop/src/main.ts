import {shell} from 'electron/common';
import {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  net,
  protocol,
  type IpcMainInvokeEvent,
} from 'electron/main';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import type {
  DesktopIpcChannel,
  DesktopIpcChannels,
  ThemeValue,
} from '@cdm-optimiser/desktop-bridge';
import {resolveRendererFile} from './resolve-renderer-file.js';

// Set by `yarn dev:desktop` so the window loads the Vite dev server (HMR).
// Ignored in packaged builds, which always load the bundled renderer.
const devServerUrl = app.isPackaged
  ? undefined
  : process.env.VITE_DEV_SERVER_URL;

// DevTools open automatically in development. Packaged builds only open them
// when launched with `--devtools`, for debugging an installed app.
const shouldOpenDevTools =
  Boolean(devServerUrl) || process.argv.includes('--devtools');

// `renderer/` holds the web build, copied in by `yarn build:renderer`.
const rendererRoot = join(app.getAppPath(), 'renderer');

// Packaged builds serve the renderer from app://cdm-optimiser/ rather than
// file://, so the web app's routes work as real paths (BrowserRouter), as
// on Netlify, and the page gets no file-system privileges. Changing the
// scheme or host changes the page's origin, which holds the Supabase session
// in localStorage: users would have to sign in again.
const APP_SCHEME = 'app';
const APP_HOST = 'cdm-optimiser';
const APP_URL = `${APP_SCHEME}://${APP_HOST}/`;

// Must run before the app is ready. `standard` gives the scheme normal URL
// rules and an origin (for localStorage and relative URLs); `secure` makes
// it a secure context, like https.
protocol.registerSchemesAsPrivileged([
  {scheme: APP_SCHEME, privileges: {standard: true, secure: true}},
]);

const THEME_VALUES: readonly ThemeValue[] = ['system', 'light', 'dark'];

function isThemeValue(value: unknown): value is ThemeValue {
  return THEME_VALUES.some((theme) => theme === value);
}

function parseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

/** Whether a URL is the app itself: the bundled renderer or the dev server. */
function isAppUrl(url: string): boolean {
  const target = parseUrl(url);

  if (!target) return false;

  if (devServerUrl) {
    return target.origin === new URL(devServerUrl).origin;
  }

  // Node's URL gives custom schemes a "null" origin, so compare the parts.
  return target.protocol === `${APP_SCHEME}:` && target.host === APP_HOST;
}

/** Serves the bundled renderer on app://cdm-optimiser/. */
function registerAppProtocol() {
  protocol.handle(APP_SCHEME, (request) => {
    const url = new URL(request.url);
    const file =
      url.host === APP_HOST
        ? resolveRendererFile(rendererRoot, url.pathname)
        : null;

    if (!file) return new Response('Not found', {status: 404});

    return net.fetch(pathToFileURL(file).toString());
  });
}

/** Opens `https:` links in the system browser; anything else is dropped. */
function openExternalIfHttps(url: string) {
  if (parseUrl(url)?.protocol === 'https:') {
    void shell.openExternal(url);
  }
}

/**
 * Registers a handler for a channel of the shared IPC contract. Arguments come
 * from the renderer, so they arrive as `unknown` and must be validated.
 */
function handle<Channel extends DesktopIpcChannel>(
  channel: Channel,
  listener: (
    event: IpcMainInvokeEvent,
    ...args: unknown[]
  ) => DesktopIpcChannels[Channel]['result']
) {
  ipcMain.handle(channel, listener);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: join(import.meta.dirname, 'preload.cjs'),
    },
  });

  win.removeMenu();

  // Links that would open a new window go to the system browser instead.
  win.webContents.setWindowOpenHandler(({url}) => {
    openExternalIfHttps(url);

    return {action: 'deny'};
  });

  // The window only ever shows the app. Other navigations open externally.
  win.webContents.on('will-navigate', (event) => {
    if (isAppUrl(event.url)) return;

    event.preventDefault();
    openExternalIfHttps(event.url);
  });

  if (shouldOpenDevTools) {
    win.webContents.openDevTools();
  }

  void win.loadURL(devServerUrl ?? APP_URL);
}

handle('dark-mode:get-source', () => {
  return nativeTheme.themeSource;
});

handle('dark-mode:set', (_event, mode) => {
  if (!isThemeValue(mode)) {
    throw new Error(`Unsupported theme: ${String(mode)}`);
  }

  nativeTheme.themeSource = mode;

  return true;
});

handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system';
});

handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  return nativeTheme.shouldUseDarkColors;
});

app.whenReady().then(() => {
  registerAppProtocol();
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
