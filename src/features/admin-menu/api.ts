import { getSupabase } from '../../lib/supabase';
import type { Menu } from '../../types/domain';
import type { MenuFormValid } from './schema';

/** Semua menu termasuk yang diarsipkan (admin). */
export async function fetchMenuAdmin(): Promise<Menu[]> {
  const { data, error } = await getSupabase()
    .from('menu')
    .select('*')
    .order('kategori')
    .order('urutan')
    .order('nama');
  if (error) throw error;
  return data;
}

export async function tambahMenu(data: MenuFormValid): Promise<void> {
  const { error } = await getSupabase().from('menu').insert(data);
  if (error) throw error;
}

export async function ubahMenu(id: string, patch: Partial<Omit<Menu, 'id'>>): Promise<void> {
  const { data, error } = await getSupabase()
    .from('menu')
    .update(patch)
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('MENU_TIDAK_DITEMUKAN');
}
