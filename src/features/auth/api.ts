import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '../../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
}

function getSessionUser(session: Session | null): AuthUser | null {
  const user = session?.user;
  return user?.email ? { id: user.id, email: user.email } : null;
}

export async function getUser(): Promise<AuthUser | null> {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw error;
  return getSessionUser(data.session);
}

export function onAuthChange(callback: (user: AuthUser | null) => void): () => void {
  const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
    callback(getSessionUser(session));
  });
  return () => data.subscription.unsubscribe();
}

export async function signInWithGoogle(redirectTo: string): Promise<void> {
  const callback = new URL(redirectTo);
  callback.hash = '';
  callback.search = '';

  const { error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: callback.href, queryParams: { prompt: 'select_account' } },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut({ scope: 'local' });
  if (error) throw error;
}

export async function fetchIsAdmin(): Promise<boolean> {
  const { data, error } = await getSupabase().rpc('is_admin');
  if (error) throw error;
  return data === true;
}
