/**
 * Aksi yang tertunda karena harus login dulu. Disimpan di sessionStorage agar bertahan
 * melewati redirect Google (M5), lalu sheet keranjang dibuka lagi saat kembali.
 */
export type AksiTertunda = 'kirim';

const key = (nomor: number) => `recoffee:pending:${nomor}`;

export function setPending(nomor: number, aksi: AksiTertunda): void {
  try {
    sessionStorage.setItem(key(nomor), aksi);
  } catch {
    // abaikan
  }
}

export function peekPending(nomor: number): AksiTertunda | null {
  try {
    return sessionStorage.getItem(key(nomor)) === 'kirim' ? 'kirim' : null;
  } catch {
    return null;
  }
}

export function clearPending(nomor: number): void {
  try {
    sessionStorage.removeItem(key(nomor));
  } catch {
    // abaikan
  }
}
