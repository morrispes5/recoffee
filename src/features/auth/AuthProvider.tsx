import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { notify } from '../../lib/notify';
import * as authApi from './api';
import { konsumsiLoginBerhasil } from './oauthError';
import { AuthContext, type AuthContextValue } from './authContext';

/** Sumber sesi awal dan perubahan sesi dari Supabase Auth. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<{ user: authApi.AuthUser | null; loading: boolean }>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    let lastUserId: string | undefined;
    try {
      return authApi.onAuthChange((user) => {
        if (lastUserId !== user?.id) {
          for (const key of ['profil', 'tagihan', 'statusTerakhir', 'admin']) {
            queryClient.removeQueries({ queryKey: [key] });
          }
          lastUserId = user?.id;
        }
        setState({ user, loading: false });
      });
    } catch {
      // Beranda tetap terbuka ketika konfigurasi belum diisi. Aksi Supabase menampilkan error.
      const timer = window.setTimeout(() => setState({ user: null, loading: false }), 0);
      return () => window.clearTimeout(timer);
    }
  }, [queryClient]);

  // Sambutan sekali setelah kembali dari Google (parameter ?code= dari PKCE).
  useEffect(() => {
    if (state.user && konsumsiLoginBerhasil()) {
      notify.success('Berhasil masuk', state.user.email);
    }
  }, [state.user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn: (redirectTo = window.location.href) => authApi.signInWithGoogle(redirectTo),
      signOut: authApi.signOut,
    }),
    [state],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
