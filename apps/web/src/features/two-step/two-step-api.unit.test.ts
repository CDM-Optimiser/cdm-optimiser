import {beforeEach, describe, expect, test, vi} from 'vitest';
import {AuthApiError, type Factor} from '@supabase/supabase-js';
import {
  removeAuthenticatorApp,
  startAppSetup,
  verifySignInCode,
} from './two-step-api.ts';

const mfa = vi.hoisted(() => ({
  listFactors: vi.fn(),
  enroll: vi.fn(),
  unenroll: vi.fn(),
  challengeAndVerify: vi.fn(),
}));
const refreshSession = vi.hoisted(() => vi.fn());

vi.mock('../../lib/supabase.ts', () => ({
  supabase: {auth: {mfa, refreshSession}},
}));

const factor = (id: string, overrides: Partial<Factor> = {}) =>
  ({
    id,
    factor_type: 'totp',
    status: 'verified',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }) as Factor;

const wrongCode = () =>
  new AuthApiError('Invalid TOTP code', 422, 'mfa_verification_failed');

describe('two-step-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('a new setup first removes setups that were never finished', async () => {
    mfa.listFactors.mockResolvedValue({
      data: {
        all: [factor('old-setup', {status: 'unverified'}), factor('phone')],
        totp: [factor('phone')],
      },
      error: null,
    });
    mfa.unenroll.mockResolvedValue({data: {}, error: null});
    mfa.enroll.mockResolvedValue({
      data: {
        id: 'new-setup',
        type: 'totp',
        totp: {qr_code: 'data:image/svg+xml;utf-8,<svg/>', secret: 'KEY'},
      },
      error: null,
    });

    const setup = await startAppSetup('Work phone');

    expect(mfa.unenroll).toHaveBeenCalledExactlyOnceWith({
      factorId: 'old-setup',
    });
    expect(mfa.enroll).toHaveBeenCalledWith({
      factorType: 'totp',
      friendlyName: 'Work phone',
      issuer: 'CDM Optimiser',
    });
    expect(setup).toEqual({
      factorId: 'new-setup',
      qrCode: 'data:image/svg+xml;utf-8,<svg/>',
      secret: 'KEY',
    });
  });

  test('a sign-in code is tried on the most recently used app first, without spaces', async () => {
    mfa.challengeAndVerify.mockResolvedValue({data: {}, error: null});

    await verifySignInCode(
      [
        factor('old', {last_challenged_at: '2026-01-01T00:00:00Z'}),
        factor('recent', {last_challenged_at: '2026-02-01T00:00:00Z'}),
      ],
      '123 456'
    );

    expect(mfa.challengeAndVerify).toHaveBeenCalledExactlyOnceWith({
      factorId: 'recent',
      code: '123456',
    });
  });

  test('a code from another app is tried on the next one', async () => {
    mfa.challengeAndVerify
      .mockResolvedValueOnce({data: null, error: wrongCode()})
      .mockResolvedValueOnce({data: {}, error: null});

    await verifySignInCode([factor('first'), factor('second')], '123456');

    expect(mfa.challengeAndVerify).toHaveBeenCalledTimes(2);
  });

  test('a code no app accepts fails with Supabase’s error', async () => {
    mfa.challengeAndVerify.mockResolvedValue({data: null, error: wrongCode()});

    await expect(
      verifySignInCode([factor('first'), factor('second')], '000000')
    ).rejects.toMatchObject({code: 'mfa_verification_failed'});
  });

  test('other errors stop at once', async () => {
    mfa.challengeAndVerify.mockResolvedValue({
      data: null,
      error: new AuthApiError('Slow down', 429, 'over_request_rate_limit'),
    });

    await expect(
      verifySignInCode([factor('first'), factor('second')], '123456')
    ).rejects.toMatchObject({code: 'over_request_rate_limit'});
    expect(mfa.challengeAndVerify).toHaveBeenCalledOnce();
  });

  test('removing an app refreshes the session straight away', async () => {
    mfa.unenroll.mockResolvedValue({data: {}, error: null});
    refreshSession.mockResolvedValue({data: {}, error: null});

    await removeAuthenticatorApp('phone');

    expect(mfa.unenroll).toHaveBeenCalledWith({factorId: 'phone'});
    expect(refreshSession).toHaveBeenCalledOnce();
  });
});
