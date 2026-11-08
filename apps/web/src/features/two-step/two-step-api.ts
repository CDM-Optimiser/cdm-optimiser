import type {Factor} from '@supabase/supabase-js';
import {supabase} from '../../lib/supabase.ts';

// The only module that calls Supabase for two-step sign-in (codes from an
// authenticator app, "TOTP" factors). Never log a QR code, key or code.

/** The name authenticator apps show next to the codes. */
const ISSUER = 'CDM Optimiser';

export interface AppSetup {
  factorId: string;
  /** An image (data URL) of the QR code to scan. */
  qrCode: string;
  /** The same key as text, for apps that can't scan. */
  secret: string;
}

/** The user's authenticator apps, once set up. */
export async function listAuthenticatorApps(): Promise<Factor[]> {
  const {data, error} = await supabase.auth.mfa.listFactors();

  if (error) throw error;

  return data.totp;
}

/**
 * Starts adding an authenticator app, returning what to scan. First it
 * removes any setup the user began and never finished, which would
 * otherwise block a second try with the same name.
 */
export async function startAppSetup(name: string): Promise<AppSetup> {
  const {data: factors, error: listError} =
    await supabase.auth.mfa.listFactors();

  if (listError) throw listError;

  for (const factor of factors.all) {
    if (factor.factor_type === 'totp' && factor.status === 'unverified') {
      const {error} = await supabase.auth.mfa.unenroll({factorId: factor.id});

      if (error) throw error;
    }
  }

  const {data, error} = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: name,
    issuer: ISSUER,
  });

  if (error) throw error;

  return {
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  };
}

/**
 * Checks a code from the app with `factorId`: it finishes a setup, or the
 * second step of signing in. Supabase then upgrades the session (`aal2`).
 */
export async function verifyAppCode(factorId: string, code: string) {
  const {error} = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code: code.replace(/\s/g, ''),
  });

  if (error) throw error;
}

/**
 * The second step of signing in. The code may come from any of the user's
 * apps, so it's tried against each, most recently used first, rather than
 * asking which app it came from. Any error other than a wrong code (too
 * many attempts, no connection) stops at once.
 */
export async function verifySignInCode(apps: Factor[], code: string) {
  const ordered = [...apps].sort((a, b) =>
    (b.last_challenged_at ?? '').localeCompare(a.last_challenged_at ?? '')
  );
  let lastError: unknown = new Error('No authenticator app to check.');

  for (const app of ordered) {
    try {
      await verifyAppCode(app.id, code);

      return;
    } catch (error) {
      if (getErrorCode(error) !== 'mfa_verification_failed') throw error;

      lastError = error;
    }
  }

  throw lastError;
}

/**
 * Removes an authenticator app. Sessions that were confirmed with it drop
 * back to the first step; refreshing now applies that straight away
 * instead of at the next token refresh.
 */
export async function removeAuthenticatorApp(factorId: string) {
  const {error} = await supabase.auth.mfa.unenroll({factorId});

  if (error) throw error;

  await supabase.auth.refreshSession();
}

function getErrorCode(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error
    ? error.code
    : undefined;
}
