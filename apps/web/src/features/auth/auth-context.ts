import {createContext} from 'react';
import type {Session, User} from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;
  /** The signed-in user, taken from `session`. */
  user: User | null;
  /** True until the session stored by Supabase has been read on start-up. */
  loading: boolean;
  /** Rejects with Supabase's error when the credentials are wrong. */
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
