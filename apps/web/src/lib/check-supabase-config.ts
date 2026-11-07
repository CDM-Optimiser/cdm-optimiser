/**
 * Problems with the Supabase settings that get bundled into the app, or an
 * empty list. Used by the build (vite.config.ts), which fails on any, and by
 * the Supabase client at start-up.
 *
 * Only a publishable key (`sb_publishable_…`) may be bundled. A secret key
 * (`sb_secret_…`) bypasses row-level security and must never reach a browser.
 */
export function checkSupabaseConfig(
  url: string | undefined,
  key: string | undefined
): string[] {
  const problems: string[] = [];

  if (!url) {
    problems.push('VITE_SUPABASE_URL is missing.');
  } else if (
    !url.startsWith('https://') &&
    !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(url)
  ) {
    problems.push(
      'VITE_SUPABASE_URL must start with https:// (http:// only for a local Supabase).'
    );
  }

  if (!key) {
    problems.push('VITE_SUPABASE_PUBLISHABLE_KEY is missing.');
  } else if (key.startsWith('sb_secret_')) {
    problems.push(
      'VITE_SUPABASE_PUBLISHABLE_KEY holds a secret key (sb_secret_…). Secret keys must never be bundled into the app: use the publishable key.'
    );
  } else if (!key.startsWith('sb_publishable_')) {
    problems.push(
      'VITE_SUPABASE_PUBLISHABLE_KEY must be a publishable key (sb_publishable_…), from Project Settings → API Keys. Legacy anon keys are no longer accepted.'
    );
  }

  return problems;
}
