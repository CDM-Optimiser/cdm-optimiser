import {describe, expect, test} from 'vitest';
import type {Factor, Session} from '@supabase/supabase-js';
import {getSignInStep} from './get-sign-in-step.ts';

/** A token shaped like Supabase's; only its claims matter here. */
function token(claims: object) {
  const part = (value: object) => {
    const bytes = new TextEncoder().encode(JSON.stringify(value));

    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  return `${part({alg: 'ES256'})}.${part(claims)}.signature`;
}

const app = (status: 'verified' | 'unverified'): Factor =>
  ({
    id: 'factor-1',
    factor_type: 'totp',
    status,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }) as Factor;

function session({
  aal = 'aal1',
  factors = [] as Factor[],
  appMetadata = {} as object,
  email = 'test.user@example.com',
} = {}) {
  return {
    access_token: token({sub: 'test-user', aal, email}),
    user: {id: 'test-user', email, app_metadata: appMetadata, factors},
  } as unknown as Session;
}

describe('getSignInStep', () => {
  test('asks for the password when signed out', () => {
    expect(getSignInStep(null)).toBe('password');
  });

  test('asks for the code when the user has an authenticator app', () => {
    expect(getSignInStep(session({factors: [app('verified')]}))).toBe(
      'verify-code'
    );
  });

  test('asks the user to set up an app when they have none', () => {
    expect(getSignInStep(session())).toBe('set-up-app');
  });

  test('an app whose setup was never finished doesn’t count', () => {
    expect(getSignInStep(session({factors: [app('unverified')]}))).toBe(
      'set-up-app'
    );
  });

  test('is signed in once the code is verified', () => {
    expect(
      getSignInStep(session({aal: 'aal2', factors: [app('verified')]}))
    ).toBe('signed-in');
  });

  test('the demo account only needs its password', () => {
    expect(getSignInStep(session({appMetadata: {demo: true}}))).toBe(
      'signed-in'
    );
  });

  test('reads tokens with non-ASCII claims', () => {
    expect(
      getSignInStep(session({aal: 'aal2', email: 'siobhán@example.ie'}))
    ).toBe('signed-in');
  });

  test('a token it can’t read never counts as the second step', () => {
    const broken = {
      ...session({factors: [app('verified')]}),
      access_token: 'not-a-token',
    } as Session;

    expect(getSignInStep(broken)).toBe('verify-code');
  });
});
