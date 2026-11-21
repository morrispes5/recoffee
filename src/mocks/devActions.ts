import { idBaru, resetDb, sesiTerbuka, ubahDb } from './db';
import { MOCK_MENU } from './menu';
import { MOCK_TEMAN_ID } from './tagihan';

/*
 * Aksi pura-pura sisi kasir/teman semeja, hanya untuk mencoba alur pelanggan di M2.
 * Fitur admin sebenarnya dibangun di M3 (UI) dan M5 (Supabase).
 */

export function temanPesan(nomor: number): void {
  ubahDb((db) => {
    let sesi = db.sesi.find((s) => s.nomor_meja === nomor && sesiTerbuka(s));
    if (!sesi) {
      sesi = {
        id: idBaru('sesi'),
        nomor_meja: nomor,
        status: 'aktif',
        metode_bayar: null,
        dibuka_at: new Date().toISOString(),
      };
      db.sesi.push(sesi);
    }
    if (sesi.status === 'minta_bill') return;
    db.pesanan.push({
      id: idBaru('pesanan'),
      sesi_id: sesi.id,
      pelanggan_id: MOCK_TEMAN_ID,
      status: 'baru',
      catatan: null,
      created_at: new Date().toISOString(),
      items: [{ nama_menu: 'Americano', qty: 1, harga_satuan: 18000 }],
    });
  });
}

/** Majukan satu pesanan tertua yang belum diantar: baru → diproses → diantar. */
export function majukanPesanan(nomor: number): void {
  ubahDb((db) => {
    const sesi = db.sesi.find((s) => s.nomor_meja === nomor && sesiTerbuka(s));
    if (!sesi) return;
    const p = db.pesanan
      .filter((x) => x.sesi_id === sesi.id && x.status !== 'diantar')
      .sort((a, b) => a.created_at.localeCompare(b.created_at))[0];
    if (p) p.status = p.status === 'baru' ? 'diproses' : 'diantar';
  });
}

export function kasirKonfirmasi(nomor: number): void {
  ubahDb((db) => {
    const sesi = db.sesi.find((s) => s.nomor_meja === nomor && sesiTerbuka(s));
    if (!sesi) return;
    sesi.status = 'selesai';
    sesi.metode_bayar = sesi.metode_bayar ?? 'kasir';
  });
}

const kopiTubruk = MOCK_MENU.find((m) => m.id === 'menu-kopi-tubruk');
if (!kopiTubruk) throw new Error('Menu uji Kopi Tubruk tidak ada di mock');
export const MENU_UJI_HABIS = kopiTubruk;

export function toggleMenuHabis(menuId: string): void {
  ubahDb((db) => {
    db.menuHabis = db.menuHabis.includes(menuId)
      ? db.menuHabis.filter((id) => id !== menuId)
      : [...db.menuHabis, menuId];
  });
}

export function toggleOffline(): void {
  ubahDb((db) => {
    db.offline = !db.offline;
  });
}

export { resetDb };
