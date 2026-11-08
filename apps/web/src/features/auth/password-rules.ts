/**
 * The shortest password Supabase accepts for a new password (runbook step
 * A1, after NIST SP 800-63B-4). Supabase enforces it; the app states it up
 * front and lets the browser check it first. Change both together.
 */
export const MIN_PASSWORD_LENGTH = 16;
