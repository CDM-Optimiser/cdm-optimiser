import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {useQueryClient} from '@tanstack/react-query';
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
 * Holds the Supabase session, and clears cached patient data on sign-out. `login` and `logout` only call Supabase: the
 * session itself always comes from `onAuthStateChange`, so it has one source.
 */
export function AuthProvider({children}: {children: ReactNode}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Fires straight away with the stored session (INITIAL_SESSION), then on
    // every sign-in, sign-out and token refresh.
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // Patient data must not outlive the session that fetched it.
      if (event === 'SIGNED_OUT') queryClient.clear();

      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const value = useMemo(
    () => ({session, user: session?.user ?? null, loading, login, logout}),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
