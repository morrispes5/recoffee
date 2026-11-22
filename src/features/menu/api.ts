import { getSupabase } from '../../lib/supabase';
import type { KategoriMenu, Menu } from '../../types/domain';

export const URUTAN_KATEGORI: KategoriMenu[] = ['kopi', 'non_kopi', 'makanan', 'camilan'];

export async function fetchMenu(): Promise<Menu[]> {
  const { data, error } = await getSupabase()
    .from('menu')
    .select('*')
    .eq('diarsipkan', false)
    .order('kategori')
    .order('urutan')
    .order('nama');
  if (error) throw error;
  return data;
}
