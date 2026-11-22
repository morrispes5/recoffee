import { describe, expect, it } from 'vitest';
import { rangkumTerlaris } from './api';

describe('rangkumTerlaris', () => {
  it('menjumlahkan qty dan omzet per menu lalu mengurutkan dari terbanyak', () => {
    const hasil = rangkumTerlaris([
      { nama_menu: 'Es Kopi Susu', qty: 2, harga_satuan: 20000 },
      { nama_menu: 'Kopi Tubruk', qty: 1, harga_satuan: 15000 },
      { nama_menu: 'Es Kopi Susu', qty: 3, harga_satuan: 20000 },
      { nama_menu: 'Teh Tarik', qty: 1, harga_satuan: 16000 },
    ]);
    expect(hasil).toEqual([
      { nama_menu: 'Es Kopi Susu', qty: 5, omzet: 100000 },
      { nama_menu: 'Teh Tarik', qty: 1, omzet: 16000 },
      { nama_menu: 'Kopi Tubruk', qty: 1, omzet: 15000 },
    ]);
  });

  it('membatasi jumlah baris', () => {
    const items = ['A', 'B', 'C'].map((n) => ({ nama_menu: n, qty: 1, harga_satuan: 1000 }));
    expect(rangkumTerlaris(items, 2)).toHaveLength(2);
  });

  it('mengembalikan daftar kosong bila belum ada pesanan', () => {
    expect(rangkumTerlaris([])).toEqual([]);
  });
});
