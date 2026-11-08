import {useEffect, useState} from 'react';
import type {UpdateStatus} from '@cdm-optimiser/desktop-bridge';

const IDLE: UpdateStatus = {state: 'idle'};

/**
 * The desktop app's update status (see apps/desktop/src/updater.ts), and a
 * way to restart into a downloaded update. In a plain browser there is no
 * `window.appUpdates`: the status stays idle, because the website is always
 * the latest version.
 */
export function useAppUpdate() {
  const appUpdates = window.appUpdates;
  const [status, setStatus] = useState<UpdateStatus>(IDLE);

  useEffect(() => {
    if (!appUpdates) return;

    let cancelled = false;

    appUpdates
      .getStatus()
      .then((current) => {
        if (!cancelled) setStatus(current);
      })
      .catch(() => {
        // The main process logs update problems; nothing to show here.
      });

    const stop = appUpdates.onStatus(setStatus);

    return () => {
      cancelled = true;
      stop();
    };
  }, [appUpdates]);

  return {status, install: () => appUpdates?.install()};
}
