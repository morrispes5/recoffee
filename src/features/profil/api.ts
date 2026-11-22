import { getSupabase } from '../../lib/supabase';
import type { Profil } from '../../types/domain';
import { getUser } from '../auth/api';

export async function fetchProfil(): Promise<Profil | null> {
  const user = await getUser();
  if (!user) throw new Error('BELUM_LOGIN');

  const { data, error } = await getSupabase()
    .from('pelanggan')
    .select('nama, no_hp, email')
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function simpanProfil(nama: string, noHp: string): Promise<void> {
  const { error } = await getSupabase().rpc('simpan_profil', { p_nama: nama, p_no_hp: noHp });
  if (error) throw error;
}
