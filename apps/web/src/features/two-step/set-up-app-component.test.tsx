import {beforeEach, describe, expect, test, vi} from 'vitest';
import {AuthApiError} from '@supabase/supabase-js';
import {renderWithProviders} from '../../test/render-with-providers.tsx';
import {SetUpAppComponent} from './set-up-app-component.tsx';

const mocks = vi.hoisted(() => ({
  startAppSetup: vi.fn(),
  verifyAppCode: vi.fn(),
}));

vi.mock('./two-step-api.ts', () => ({
  startAppSetup: mocks.startAppSetup,
  verifyAppCode: mocks.verifyAppCode,
}));

// A tiny made-up QR code: an SVG data URL, as Supabase returns.
const QR_CODE =
  'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>';

async function renderSetup(
  props: Partial<Parameters<typeof SetUpAppComponent>[0]> = {}
) {
  const {screen} = await renderWithProviders(
    <SetUpAppComponent
      defaultName="Authenticator app"
      confirmLabel="Turn on two-step sign-in"
      {...props}
    />
  );

  return screen;
}

describe('SetUpAppComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.startAppSetup.mockResolvedValue({
      factorId: 'new-app',
      qrCode: QR_CODE,
      secret: 'ABCDEFGHIJKLMNOP',
    });
  });

  test('creates nothing until the user asks for the QR code', async () => {
    const screen = await renderSetup();

    await expect
      .element(screen.getByLabelText('Name for this app'))
      .toHaveValue('Authenticator app');
    expect(mocks.startAppSetup).not.toHaveBeenCalled();
  });

  test('shows the QR code and the key, then turns it on with the first code', async () => {
    mocks.verifyAppCode.mockResolvedValue(undefined);
    const onDone = vi.fn();
    const screen = await renderSetup({onDone});

    await screen.getByLabelText('Name for this app').fill('Work phone');
    await screen.getByRole('button', {name: 'Show the QR code'}).click();

    await expect
      .element(
        screen.getByRole('img', {
          name: 'QR code to scan with your authenticator app',
        })
      )
      .toHaveAttribute('src', QR_CODE);
    await expect.element(screen.getByText('ABCD EFGH IJKL MNOP')).toBeVisible();
    expect(mocks.startAppSetup).toHaveBeenCalledWith('Work phone');

    await screen
      .getByLabelText('Code from your authenticator app')
      .fill('123456');
    await screen
      .getByRole('button', {name: 'Turn on two-step sign-in'})
      .click();

    await vi.waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(mocks.verifyAppCode).toHaveBeenCalledWith('new-app', '123456');
  });

  test('says when the first code is wrong', async () => {
    mocks.verifyAppCode.mockRejectedValue(
      new AuthApiError('Invalid TOTP code', 422, 'mfa_verification_failed')
    );
    const screen = await renderSetup();

    await screen.getByRole('button', {name: 'Show the QR code'}).click();
    await screen
      .getByLabelText('Code from your authenticator app')
      .fill('000000');
    await screen
      .getByRole('button', {name: 'Turn on two-step sign-in'})
      .click();

    await expect
      .element(screen.getByRole('alert').getByText(/That code didn’t work/))
      .toBeVisible();
  });

  test('says when a name is already taken', async () => {
    mocks.startAppSetup.mockRejectedValue(
      new AuthApiError('Name taken', 422, 'mfa_factor_name_conflict')
    );
    const screen = await renderSetup();

    await screen.getByRole('button', {name: 'Show the QR code'}).click();

    await expect
      .element(
        screen
          .getByRole('alert')
          .getByText(/already have an app with this name/)
      )
      .toBeVisible();
  });

  test('can be cancelled when a Cancel action is given', async () => {
    const onCancel = vi.fn();
    const screen = await renderSetup({onCancel});

    await screen.getByRole('button', {name: 'Cancel'}).click();

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
