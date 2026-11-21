import { bacaUserMock, dengarUserMock, MOCK_USERS, setUserMock } from '../../mocks/db';

export interface AuthUser {
  id: string;
  email: string;
}

/** M5: supabase.auth.getSession() */
export async function getUser(): Promise<AuthUser | null> {
  return bacaUserMock();
}

/** M5: supabase.auth.onAuthStateChange(...) */
export function onAuthChange(cb: (user: AuthUser | null) => void): () => void {
  return dengarUserMock(cb);
}

/**
 * M5: supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } }).
 * Mock M2–M3: tidak ada redirect; anggap langsung kembali dari Google. Tujuan `/admin` masuk
 * sebagai kasir demo, selain itu sebagai pelanggan demo. Cek is_admin() dibuat di M5.
 */
export async function signInWithGoogle(redirectTo: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
  const keAdmin = new URL(redirectTo, window.location.origin).pathname.startsWith('/admin');
  setUserMock(keAdmin ? MOCK_USERS.admin : MOCK_USERS.saya);
}

/** M5: supabase.auth.signOut() */
export async function signOut(): Promise<void> {
  setUserMock(null);
}
