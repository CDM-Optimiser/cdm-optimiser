import type {User} from '@supabase/supabase-js';

/**
 * Where a user's name can be in their Supabase metadata, in order. Supabase
 * has no name field of its own; the runbook says how to set
 * `display_name`.
 */
const NAME_KEYS = ['display_name', 'full_name', 'name'] as const;

/** The name to show for the signed-in user, or their email without one. */
export function getUserDisplayName(user: User): string {
  const metadata: Record<string, unknown> = user.user_metadata ?? {};

  for (const key of NAME_KEYS) {
    const value = metadata[key];

    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  return user.email ?? 'Signed-in user';
}
