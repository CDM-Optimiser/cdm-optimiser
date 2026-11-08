import {useCallback, useEffect, useMemo, useState, type ReactNode} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import type {Session, WeakPassword} from '@supabase/supabase-js';
import {supabase} from '../../lib/supabase.ts';
import {AuthContext} from './auth-context.ts';
import {getSignInStep} from './get-sign-in-step.ts';

async function logout() {
  const {error} = await supabase.auth.signOut();

  if (error) throw error;
}

/**
 * Holds the Supabase session, and clears cached patient data on sign-out.
 * `login`, `logout` and `changePassword` only call Supabase: the session
 * itself always comes from `onAuthStateChange`, so it has one source.
 */
export function AuthProvider({children}: {children: ReactNode}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [weakPassword, setWeakPassword] = useState<WeakPassword | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Fires straight away with the stored session (INITIAL_SESSION), then on
    // every sign-in, sign-out and token refresh.
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'SIGNED_OUT') {
        // Patient data must not outlive the session that fetched it.
        queryClient.clear();
        setWeakPassword(null);
      }

      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const login = useCallback(async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setWeakPassword(data.weakPassword ?? null);
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const {error} = await supabase.auth.updateUser({
        password: newPassword,
        current_password: currentPassword,
      });

      if (error) throw error;

      setWeakPassword(null);
    },
    []
  );

  const dismissWeakPassword = useCallback(() => setWeakPassword(null), []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signInStep: getSignInStep(session),
      login,
      logout,
      changePassword,
      weakPassword,
      dismissWeakPassword,
    }),
    [session, loading, login, changePassword, weakPassword, dismissWeakPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
