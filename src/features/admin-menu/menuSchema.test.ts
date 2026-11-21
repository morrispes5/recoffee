import { describe, expect, it } from 'vitest';
import { PESAN_MENU, validasiMenu, type MenuFormInput } from './schema';

const valid: MenuFormInput = {
  nama: 'Kopi Tubruk',
  deskripsi: '',
  kategori: 'kopi',
  harga: '15000',
  urutan: '1',
};

describe('validasiMenu', () => {
  it('menerima data valid dan mengubah tipe', () => {
    const hasil = validasiMenu(valid);
    expect(hasil.ok).toBe(true);
    if (hasil.ok) {
      expect(hasil.data).toEqual({
        nama: 'Kopi Tubruk',
        deskripsi: null,
        kategori: 'kopi',
        harga: 15000,
        urutan: 1,
      });
    }
  });

  it('menolak nama 1 karakter dan 61 karakter', () => {
    for (const nama of ['K', 'k'.repeat(61)]) {
      const hasil = validasiMenu({ ...valid, nama });
      expect(hasil.ok).toBe(false);
      if (!hasil.ok) expect(hasil.errors.nama).toBe(PESAN_MENU.nama);
    }
  });

  it.each([
    ['0', false],
    ['1', true],
    ['1000000', true],
    ['1000001', false],
    ['15.000', false],
    ['-5', false],
    ['', false],
    ['abc', false],
  ])('harga %j valid=%s', (harga, ok) => {
    const hasil = validasiMenu({ ...valid, harga });
    expect(hasil.ok).toBe(ok);
    if (!hasil.ok) expect(hasil.errors.harga).toBe(PESAN_MENU.harga);
  });

  it('menolak deskripsi lebih dari 160 huruf', () => {
    const hasil = validasiMenu({ ...valid, deskripsi: 'a'.repeat(161) });
    expect(!hasil.ok && hasil.errors.deskripsi).toBe(PESAN_MENU.deskripsi);
  });

  it('menolak kategori tidak dikenal', () => {
    const hasil = validasiMenu({ ...valid, kategori: 'minuman' });
    expect(!hasil.ok && hasil.errors.kategori).toBe(PESAN_MENU.kategori);
  });
});
