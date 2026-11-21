import type { ItemTagihan } from '../types/domain';
import type { MockDb, MockPesanan, MockSesi } from './db';
import { MOCK_MENU } from './menu';

export const MOCK_TEMAN_ID = 'mock-pelanggan-dimas';

const item = (nama_menu: string, qty: number, harga_satuan: number): ItemTagihan => ({
  nama_menu,
  qty,
  harga_satuan,
});

/**
 * Kondisi awal data mock agar denah admin terlihat hidup:
 * meja 3 minta bill (QRIS), meja 7 dan 12 terisi, meja 21 minta bill (kasir), sisanya kosong.
 * Meja 18 sengaja kosong untuk mencoba alur pelanggan dari awal.
 */
export function seedMockDb(): MockDb {
  const sekarang = Date.now();
  const menit = (n: number) => new Date(sekarang - n * 60_000).toISOString();

  const sesi = (
    id: string,
    nomor_meja: number,
    status: MockSesi['status'],
    dibuka: number,
    metode: MockSesi['metode_bayar'] = null,
    mintaBill: number | null = null,
  ): MockSesi => ({
    id,
    nomor_meja,
    status,
    metode_bayar: metode,
    dibuka_at: menit(dibuka),
    minta_bill_at: mintaBill === null ? null : menit(mintaBill),
    ditutup_at: null,
    total_bayar: null,
    dikonfirmasi_oleh: null,
  });

  const pesanan = (
    id: string,
    sesi_id: string,
    pelanggan_id: string,
    status: MockPesanan['status'],
    dibuat: number,
    items: ItemTagihan[],
    catatan: string | null = null,
  ): MockPesanan => ({
    id,
    sesi_id,
    pelanggan_id,
    status,
    catatan,
    created_at: menit(dibuat),
    items,
  });

  return {
    menu: MOCK_MENU.map((m) => ({ ...m })),
    sesi: [
      sesi('sesi-meja-3', 3, 'minta_bill', 70, 'qris', 4),
      sesi('sesi-meja-7', 7, 'aktif', 25),
      sesi('sesi-meja-12', 12, 'aktif', 12),
      sesi('sesi-meja-21', 21, 'minta_bill', 55, 'kasir', 2),
    ],
    pesanan: [
      pesanan('pesanan-3-1', 'sesi-meja-3', 'mock-pelanggan-sari', 'diantar', 68, [
        item('Kopi Susu Gula Aren', 2, 22000),
        item('Pisang Goreng', 1, 14000),
      ]),
      pesanan(
        'pesanan-7-1',
        'sesi-meja-7',
        MOCK_TEMAN_ID,
        'diproses',
        24,
        [item('Kopi Tubruk', 1, 15000), item('Roti Bakar Srikaya', 1, 18000)],
        'Kopinya jangan terlalu manis',
      ),
      pesanan('pesanan-12-1', 'sesi-meja-12', 'mock-pelanggan-budi', 'diantar', 11, [
        item('Es Kopi Susu', 3, 20000),
      ]),
      pesanan(
        'pesanan-12-2',
        'sesi-meja-12',
        'mock-pelanggan-ayu',
        'baru',
        3,
        [item('Indomie Telur', 2, 15000), item('Es Teh Manis', 2, 8000)],
        'Indomie goreng satu, rebus satu',
      ),
      pesanan('pesanan-21-1', 'sesi-meja-21', 'mock-pelanggan-budi', 'diantar', 54, [
        item('Americano', 1, 18000),
        item('Kerupuk Kaleng', 2, 3000),
      ]),
    ],
    profil: {
      [MOCK_TEMAN_ID]: { nama: 'Dimas', no_hp: '081298765432', email: 'dimas.demo@gmail.com' },
      'mock-pelanggan-sari': { nama: 'Sari', no_hp: '085712340001', email: 'sari.demo@gmail.com' },
      'mock-pelanggan-budi': { nama: 'Budi', no_hp: '081355550002', email: 'budi.demo@gmail.com' },
      'mock-pelanggan-ayu': { nama: 'Ayu', no_hp: '087866660003', email: 'ayu.demo@gmail.com' },
    },
    offline: false,
  };
}
