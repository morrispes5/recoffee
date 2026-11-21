import { bacaDb, bacaUserMock, tundaMock, ubahDb } from '../../mocks/db';
import type { Profil } from '../../types/domain';
import { normalisasiHp, POLA_HP } from './schema';

/** M5: from('pelanggan').select('nama, no_hp, email').eq('id', user.id).maybeSingle() */
export async function fetchProfil(): Promise<Profil | null> {
  await tundaMock();
  const user = bacaUserMock();
  if (!user) throw new Error('BELUM_LOGIN');
  return bacaDb().profil[user.id] ?? null;
}

/** M5: rpc('simpan_profil', { p_nama, p_no_hp }). Validasi sama dengan function database. */
export async function simpanProfil(nama: string, noHp: string): Promise<void> {
  await tundaMock();
  const user = bacaUserMock();
  if (!user) throw new Error('BELUM_LOGIN');
  const namaBersih = nama.trim();
  const hp = normalisasiHp(noHp);
  if (namaBersih.length < 2 || namaBersih.length > 50 || !POLA_HP.test(hp)) {
    throw new Error('PROFIL_TIDAK_VALID');
  }
  ubahDb((db) => {
    db.profil[user.id] = { nama: namaBersih, no_hp: hp, email: user.email.toLowerCase() };
  });
}
