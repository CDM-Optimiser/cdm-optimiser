import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {InfoCircleFilledIcon} from '@cdm-optimiser/ui/icons/info-circle-filled-icon.tsx';
import {useAppUpdate} from './use-app-update.ts';

/**
 * Tells desktop users a new version has downloaded, and lets them restart
 * into it. Ignoring it is fine: it installs the next time the app closes.
 * Fixed to the bottom-left corner so it shows on every page, including the
 * login page.
 */
export function UpdateNoticeComponent() {
  const {status, install} = useAppUpdate();

  if (status.state !== 'ready') return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-10 flex max-w-sm gap-3 rounded-xl border-l-4 border-sky-700 bg-sky-50 p-4 text-sky-800 shadow-md"
    >
      <InfoCircleFilledIcon className="shrink-0 text-sky-700" />
      <div className="flex flex-col gap-3">
        <p>
          <strong className="font-medium">
            Version {status.version} is ready.
          </strong>{' '}
          Restart the app to update. Otherwise it updates the next time you
          close it.
        </p>
        <ButtonComponent className="self-start" onClick={() => void install()}>
          Restart now
        </ButtonComponent>
      </div>
    </div>
  );
}
