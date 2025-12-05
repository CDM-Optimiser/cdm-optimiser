import {useEffect, useMemo, useState} from 'react';
import type {Session, User} from '@supabase/supabase-js';
import {supabase} from '../api/supabase.ts';
import {AuthContext} from './authContext.tsx';

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();

    setSession(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      login,
      logout,
    }),
    [session, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
