import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {AuthApiError} from '@supabase/supabase-js';
import {VerifyCodeFormComponent} from './verify-code-form-component.tsx';

const mocks = vi.hoisted(() => ({useAuth: vi.fn(), verifySignInCode: vi.fn()}));

vi.mock('../auth/use-auth.ts', () => ({useAuth: mocks.useAuth}));
vi.mock('./two-step-api.ts', () => ({
  verifySignInCode: mocks.verifySignInCode,
}));

const phone = {id: 'phone', factor_type: 'totp', status: 'verified'};
const unfinished = {
  id: 'unfinished',
  factor_type: 'totp',
  status: 'unverified',
};

describe('VerifyCodeFormComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({user: {factors: [phone, unfinished]}});
  });

  test('the code field lets phones and password managers fill it in', async () => {
    const screen = await render(<VerifyCodeFormComponent />);
    const field = screen.getByLabelText('Code from your authenticator app');

    await expect
      .element(field)
      .toHaveAttribute('autocomplete', 'one-time-code');
    await expect.element(field).toHaveAttribute('inputmode', 'numeric');
    await expect
      .element(field)
      .toHaveAccessibleDescription('6 digits. It changes every 30 seconds.');
  });

  test('checks the code against the user’s finished apps', async () => {
    mocks.verifySignInCode.mockResolvedValue(undefined);
    const screen = await render(<VerifyCodeFormComponent />);

    await screen
      .getByLabelText('Code from your authenticator app')
      .fill('123 456');
    await screen.getByRole('button', {name: 'Continue'}).click();

    await vi.waitFor(() =>
      expect(mocks.verifySignInCode).toHaveBeenCalledExactlyOnceWith(
        [phone],
        '123 456'
      )
    );
  });

  test('says when the code is wrong, once', async () => {
    mocks.verifySignInCode.mockRejectedValue(
      new AuthApiError('Invalid TOTP code', 422, 'mfa_verification_failed')
    );
    const screen = await render(<VerifyCodeFormComponent />);

    await screen
      .getByLabelText('Code from your authenticator app')
      .fill('000000');
    await screen.getByRole('button', {name: 'Continue'}).click();

    await expect
      .element(screen.getByRole('alert').getByText(/That code didn’t work/))
      .toBeVisible();
    expect(screen.getByRole('alert').elements()).toHaveLength(1);
  });
});
