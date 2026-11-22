export function readSupabaseEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) throw new Error('SUPABASE_ENV_INVALID');

  if (!key.startsWith('sb_publishable_')) {
    // Kunci JWT lama hanya boleh dipakai bila perannya anon.
    try {
      const payload = key.split('.')[1];
      if (!payload) throw new Error();
      const claims: unknown = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      if (typeof claims !== 'object' || !claims || !('role' in claims) || claims.role !== 'anon') {
        throw new Error();
      }
    } catch {
      throw new Error('SUPABASE_ENV_INVALID');
    }
  }

  return { url, key };
}
