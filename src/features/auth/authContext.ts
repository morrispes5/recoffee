import { createContext } from 'react';
import type { AuthUser } from './api';

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** Masuk dengan Google, kembali ke `redirectTo` (default: halaman saat ini). */
  signIn: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
