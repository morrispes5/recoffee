import { bacaDb, tundaMock } from '../../mocks/db';
import { MOCK_MENU } from '../../mocks/menu';
import type { KategoriMenu, Menu } from '../../types/domain';

export const URUTAN_KATEGORI: KategoriMenu[] = ['kopi', 'non_kopi', 'makanan', 'camilan'];

/**
 * Menu yang tidak diarsipkan, urut kategori lalu urutan.
 * M5: from('menu').select(...).order('kategori').order('urutan')
 */
export async function fetchMenu(): Promise<Menu[]> {
  await tundaMock();
  const { menuHabis } = bacaDb();
  return MOCK_MENU.filter((m) => !m.diarsipkan)
    .map((m) => ({ ...m, tersedia: m.tersedia && !menuHabis.includes(m.id) }))
    .sort(
      (a, b) =>
        URUTAN_KATEGORI.indexOf(a.kategori) - URUTAN_KATEGORI.indexOf(b.kategori) ||
        a.urutan - b.urutan,
    );
}
