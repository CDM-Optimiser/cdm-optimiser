import type {UpdateStatus} from '@cdm-optimiser/desktop-bridge';
import {app} from 'electron/main';
// electron-updater is CommonJS: take `autoUpdater` from its default export.
import electronUpdater from 'electron-updater';

const {autoUpdater} = electronUpdater;

/** How often a running app checks GitHub for a newer release. */
const CHECK_EVERY_MS = 4 * 60 * 60 * 1000;

let status: UpdateStatus = {state: 'idle'};

export function getUpdateStatus(): UpdateStatus {
  return status;
}

/**
 * Keeps the installed app up to date from GitHub Releases (the `publish`
 * section of electron-builder.yml). A newer release downloads in the
 * background, and its SHA-512 checksum is verified; the user then restarts
 * from the app, or it installs the next time the app quits.
 *
 * Only the packaged Windows app updates: the installer is NSIS, and
 * development builds have nothing to update.
 */
export function startUpdater(onStatus: (status: UpdateStatus) => void) {
  if (!app.isPackaged || process.platform !== 'win32') return;

  const setStatus = (next: UpdateStatus) => {
    status = next;
    onStatus(next);
  };

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;
  // Its default logger writes every request to the console.
  autoUpdater.logger = null;

  autoUpdater.on('update-available', (info) =>
    setStatus({state: 'downloading', version: info.version})
  );
  autoUpdater.on('update-downloaded', (info) =>
    setStatus({state: 'ready', version: info.version})
  );
  autoUpdater.on('error', (error) => {
    // Usually no network (clinics can be offline): try again next time.
    console.warn('Update check failed:', error.message);

    if (status.state === 'downloading') setStatus({state: 'idle'});
  });

  const check = () => {
    autoUpdater.checkForUpdates().catch(() => {
      // Reported by the 'error' event above.
    });
  };

  check();
  setInterval(check, CHECK_EVERY_MS);
}

/** Restarts into a downloaded update. Does nothing if none is ready. */
export function installUpdate() {
  if (status.state !== 'ready') return;

  // Silent install, then start the new version.
  autoUpdater.quitAndInstall(true, true);
}
