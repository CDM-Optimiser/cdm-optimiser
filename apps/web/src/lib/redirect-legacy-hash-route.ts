/**
 * Older builds used hash routes (`/#/pending-patients`). Turns such a URL
 * into the path it stands for, so saved links and bookmarks keep working.
 * Supabase auth redirects put tokens in the hash too (`#access_token=…`);
 * those don't start with `#/` and are left alone.
 */
export function redirectLegacyHashRoute(location: Location, history: History) {
  if (!location.hash.startsWith('#/')) return;

  history.replaceState(history.state, '', location.hash.slice(1));
}
