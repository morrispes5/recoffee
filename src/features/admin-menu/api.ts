import { bacaDb, idBaru, tundaMock, ubahDb } from '../../mocks/db';
import type { Menu } from '../../types/domain';
import { urutkanMenu } from '../menu/api';
import type { MenuFormValid } from './schema';

/** Semua menu termasuk yang diarsipkan (admin). M5: from('menu').select('*') dengan RLS admin. */
export async function fetchMenuAdmin(): Promise<Menu[]> {
  await tundaMock();
  return [...bacaDb().menu].sort(urutkanMenu);
}

/** M5: from('menu').insert(data) */
export async function tambahMenu(data: MenuFormValid): Promise<void> {
  await tundaMock();
  ubahDb((db) => {
    db.menu.push({ id: idBaru('menu'), ...data, tersedia: true, diarsipkan: false });
  });
}

/** M5: from('menu').update(patch).eq('id', id). Tidak ada delete (BR-09). */
export async function ubahMenu(id: string, patch: Partial<Omit<Menu, 'id'>>): Promise<void> {
  await tundaMock();
  ubahDb((db) => {
    const menu = db.menu.find((m) => m.id === id);
    if (!menu) throw new Error('Menu tidak ditemukan');
    Object.assign(menu, patch);
  });
}
