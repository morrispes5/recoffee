import { parseNomorMeja } from './meja';

const KEY = 'recoffee:meja-terakhir';

/** Ingat meja terakhir yang dibuka di browser ini, untuk tombol "Lanjut ke meja X" di beranda. */
export function simpanMejaTerakhir(nomor: number): void {
  try {
    localStorage.setItem(KEY, String(nomor));
  } catch {
    // Mode privat / penyimpanan penuh: fitur ini opsional.
  }
}

export function bacaMejaTerakhir(): number | null {
  try {
    return parseNomorMeja(localStorage.getItem(KEY) ?? undefined);
  } catch {
    return null;
  }
}
