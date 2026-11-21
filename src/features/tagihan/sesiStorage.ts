/** sesi_id terakhir per meja di sessionStorage, untuk mendeteksi layar terima kasih (M5 tugas 6). */
const key = (nomor: number) => `recoffee:sesi:${nomor}`;

export function bacaSesiTerakhir(nomor: number): string | null {
  try {
    return sessionStorage.getItem(key(nomor));
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
