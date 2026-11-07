/**
 * Where to go after signing in: the page the protected layout sent the user
 * away from (kept in the router's location state), or the patients list.
 * Only in-app paths are accepted.
 */
export function getRedirectPath(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const {from} = state;

    if (
      typeof from === 'string' &&
      from.startsWith('/') &&
      !from.startsWith('//')
    ) {
      return from;
    }
  }

  return '/';
}
