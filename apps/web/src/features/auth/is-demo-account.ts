import type {User} from '@supabase/supabase-js';

/**
 * Whether `user` is the public demo account, whose password nobody may
 * change. Runbook step P2 marks it in `app_metadata`, which users can't
 * edit, and the database refuses a new password for it whatever the app
 * does: this only decides what the app shows.
 */
export function isDemoAccount(user: User | null): boolean {
  return user?.app_metadata?.demo === true;
}
