import { z } from 'zod';

/** sesi_id terakhir per meja di sessionStorage, untuk mendeteksi layar terima kasih (M5 tugas 6). */
const key = (nomor: number) => `recoffee:sesi:${nomor}`;
const sesiIdSchema = z.uuid();

export function bacaSesiTerakhir(nomor: number): string | null {
  try {
    const parsed = sesiIdSchema.safeParse(sessionStorage.getItem(key(nomor)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function simpanSesiTerakhir(nomor: number, sesiId: string): void {
  try {
    sessionStorage.setItem(key(nomor), sesiId);
  } catch {
    // abaikan
  }
}
