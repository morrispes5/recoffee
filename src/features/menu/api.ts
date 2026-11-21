import { bacaDb, tundaMock } from '../../mocks/db';
import type { KategoriMenu, Menu } from '../../types/domain';

export const URUTAN_KATEGORI: KategoriMenu[] = ['kopi', 'non_kopi', 'makanan', 'camilan'];

export function urutkanMenu(a: Menu, b: Menu): number {
  return (
    URUTAN_KATEGORI.indexOf(a.kategori) - URUTAN_KATEGORI.indexOf(b.kategori) ||
    a.urutan - b.urutan ||
    a.nama.localeCompare(b.nama)
  );
}

/**
 * Menu yang tidak diarsipkan, urut kategori lalu urutan.
 * M5: from('menu').select(...).order('kategori').order('urutan')
 */
export async function fetchMenu(): Promise<Menu[]> {
  await tundaMock();
  return bacaDb()
    .menu.filter((m) => !m.diarsipkan)
    .sort(urutkanMenu);
}
