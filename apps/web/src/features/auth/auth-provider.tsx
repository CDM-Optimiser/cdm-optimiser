import {useEffect, useMemo, useState, type ReactNode} from 'react';
import type {Session} from '@supabase/supabase-js';
import {supabase} from '../../lib/supabase.ts';
import {AuthContext} from './auth-context.ts';

async function login(email: string, password: string) {
  const {error} = await supabase.auth.signInWithPassword({email, password});

  if (error) throw error;
}

async function logout() {
  const {error} = await supabase.auth.signOut();

  if (error) throw error;
}

/**
 * Holds the Supabase session. `login` and `logout` only call Supabase: the
 * session itself always comes from `onAuthStateChange`, so it has one source.
 */
export function AuthProvider({children}: {children: ReactNode}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fires straight away with the stored session (INITIAL_SESSION), then on
    // every sign-in, sign-out and token refresh.
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({session, user: session?.user ?? null, loading, login, logout}),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
