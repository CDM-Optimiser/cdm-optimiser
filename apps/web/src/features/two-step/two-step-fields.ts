/**
 * The props for a field taking an authenticator app's 6-digit code (spaces
 * allowed), for the sign-in step and the setup alike. `one-time-code` lets
 * phones and password managers offer the code.
 */
export const CODE_FIELD = {
  name: 'code',
  type: 'text',
  inputMode: 'numeric',
  autoComplete: 'one-time-code',
  pattern: '[0-9 ]{6,7}',
  required: true,
} as const;

/** TanStack Query key for the user's authenticator apps. */
export const AUTHENTICATOR_APPS_KEY = ['auth', 'authenticator-apps'] as const;
