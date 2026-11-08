import {createContext} from 'react';
import type {Session, User, WeakPassword} from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;
  /** The signed-in user, taken from `session`. */
  user: User | null;
  /** True until the session stored by Supabase has been read on start-up. */
  loading: boolean;
  /** Rejects with Supabase's error when the credentials are wrong. */
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /**
   * Changes the signed-in user's password. Supabase checks the current one
   * (runbook P1) and the rules for the new one, and signs the user out on
   * their other devices. Rejects with Supabase's error.
   */
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  /**
   * Set when Supabase said, at sign-in, that the password breaks the
   * current rules (too short, or found in a leak). Sign-in still works.
   * Cleared on sign-out, after a password change, or when dismissed.
   */
  weakPassword: WeakPassword | null;
  dismissWeakPassword: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
