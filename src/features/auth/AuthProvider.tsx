import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from './api';
import { AuthContext, type AuthContextValue } from './authContext';

/** Sesi login (Google). M2: mock; M5: Supabase Auth. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [state, setState] = useState<{ user: authApi.AuthUser | null; loading: boolean }>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    let aktif = true;
    void authApi.getUser().then((user) => {
      if (aktif) setState({ user, loading: false });
    });
    const berhenti = authApi.onAuthChange((user) => {
      setState({ user, loading: false });
      // Ganti akun: buang data milik akun sebelumnya.
      qc.removeQueries({ queryKey: ['profil'] });
      void qc.invalidateQueries({ queryKey: ['tagihan'] });
    });
    return () => {
      aktif = false;
      berhenti();
    };
  }, [qc]);

  const signIn = useCallback(
    (redirectTo: string = window.location.href) => authApi.signInWithGoogle(redirectTo),
    [],
  );
  const signOut = useCallback(() => authApi.signOut(), []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signIn, signOut }),
    [state, signIn, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
