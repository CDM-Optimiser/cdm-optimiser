import {afterEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import type {AppUpdatesApi, UpdateStatus} from '@cdm-optimiser/desktop-bridge';
import {UpdateNoticeComponent} from './update-notice-component.tsx';

/** A stand-in for the bridge the desktop app's preload script exposes. */
function fakeAppUpdates(initial: UpdateStatus) {
  let listener: ((status: UpdateStatus) => void) | undefined;
  const stop = vi.fn();

  const appUpdates = {
    getStatus: vi.fn(async () => initial),
    install: vi.fn(async () => {}),
    onStatus: vi.fn((next: (status: UpdateStatus) => void) => {
      listener = next;
      return stop;
    }),
  } satisfies AppUpdatesApi;

  window.appUpdates = appUpdates;

  return {appUpdates, stop, emit: (status: UpdateStatus) => listener?.(status)};
}

describe('UpdateNoticeComponent', () => {
  afterEach(() => {
    delete window.appUpdates;
  });

  test('shows nothing on the website', async () => {
    const screen = await render(<UpdateNoticeComponent />);

    expect(screen.container).toBeEmptyDOMElement();
  });

  test('shows nothing while there is no update, or one is downloading', async () => {
    const {emit} = fakeAppUpdates({state: 'idle'});

    const screen = await render(<UpdateNoticeComponent />);
    emit({state: 'downloading', version: '1.1.0'});

    await expect
      .element(screen.getByRole('button', {name: 'Restart now'}))
      .not.toBeInTheDocument();
  });

  test('offers a restart once an update is ready, and installs it', async () => {
    const {appUpdates} = fakeAppUpdates({state: 'ready', version: '1.1.0'});

    const screen = await render(<UpdateNoticeComponent />);

    await expect
      .element(screen.getByRole('status').getByText('Version 1.1.0 is ready.'))
      .toBeVisible();
    await screen.getByRole('button', {name: 'Restart now'}).click();

    expect(appUpdates.install).toHaveBeenCalledTimes(1);
  });

  test('appears when an update finishes downloading', async () => {
    const {emit} = fakeAppUpdates({state: 'downloading', version: '1.1.0'});

    const screen = await render(<UpdateNoticeComponent />);
    emit({state: 'ready', version: '1.1.0'});

    await expect
      .element(screen.getByRole('button', {name: 'Restart now'}))
      .toBeVisible();
  });

  test('stops listening when it unmounts', async () => {
    const {stop} = fakeAppUpdates({state: 'idle'});

    const screen = await render(<UpdateNoticeComponent />);
    await screen.unmount();

    expect(stop).toHaveBeenCalledTimes(1);
  });
});
