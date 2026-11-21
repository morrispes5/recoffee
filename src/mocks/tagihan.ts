import type { MockDb } from './db';

export const MOCK_TEMAN_ID = 'mock-pelanggan-dimas';

/**
 * Kondisi awal data mock: meja 7 sudah terisi pesanan Dimas (untuk mencoba open bill),
 * meja lain kosong.
 */
export function seedMockDb(): MockDb {
  const sekarang = Date.now();
  const menit = (n: number) => new Date(sekarang - n * 60_000).toISOString();
  return {
    sesi: [
      {
        id: 'sesi-meja-7',
        nomor_meja: 7,
        status: 'aktif',
        metode_bayar: null,
        dibuka_at: menit(25),
      },
    ],
    pesanan: [
      {
        id: 'pesanan-meja-7-1',
        sesi_id: 'sesi-meja-7',
        pelanggan_id: MOCK_TEMAN_ID,
        status: 'diproses',
        catatan: 'Es-nya sedikit saja',
        created_at: menit(24),
        items: [
          { nama_menu: 'Kopi Tubruk', qty: 1, harga_satuan: 15000 },
          { nama_menu: 'Roti Bakar Srikaya', qty: 1, harga_satuan: 18000 },
        ],
      },
    ],
    profil: {
      [MOCK_TEMAN_ID]: { nama: 'Dimas', no_hp: '081298765432', email: 'dimas.demo@gmail.com' },
    },
    menuHabis: [],
    offline: false,
  };
}
