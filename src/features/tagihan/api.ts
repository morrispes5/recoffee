import {
  bacaDb,
  bacaUserMock,
  idBaru,
  sesiTerbuka,
  tundaMock,
  ubahDb,
  type MockPesanan,
} from '../../mocks/db';
import { TOTAL_MEJA } from '../../lib/meja';
import type { MetodeBayar, StatusSesi, Tagihan } from '../../types/domain';

/** Yang dikirim frontend hanya menu_id + qty. Harga diambil "database" (PRD aturan 7). */
export interface ItemKirim {
  menu_id: string;
  qty: number;
}

/** M5: rpc('get_tagihan_meja', { p_nomor_meja }) */
export async function fetchTagihan(nomorMeja: number): Promise<Tagihan | null> {
  await tundaMock();
  const user = bacaUserMock();
  if (!user) throw new Error('BELUM_LOGIN');

  const db = bacaDb();
  const sesi = db.sesi.find((s) => s.nomor_meja === nomorMeja && sesiTerbuka(s));
  if (!sesi || !sesiTerbuka(sesi)) return null;

  const pesanan = db.pesanan
    .filter((p) => p.sesi_id === sesi.id)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((p) => ({
      id: p.id,
      status: p.status,
      catatan: p.catatan,
      dipesan_oleh: db.profil[p.pelanggan_id]?.nama ?? 'Pelanggan',
      milik_saya: p.pelanggan_id === user.id,
      created_at: p.created_at,
      items: p.items,
    }));

  const total = pesanan.flatMap((p) => p.items).reduce((sum, i) => sum + i.qty * i.harga_satuan, 0);

  return {
    sesi_id: sesi.id,
    nomor_meja: sesi.nomor_meja,
    status: sesi.status,
    metode_bayar: sesi.metode_bayar,
    dibuka_at: sesi.dibuka_at,
    total,
    pesanan,
  };
}

/** M5: rpc('buat_pesanan', { p_nomor_meja, p_items, p_catatan }). Meniru validasi PRD 13.3. */
export async function kirimPesanan(
  nomorMeja: number,
  items: ItemKirim[],
  catatan: string,
): Promise<string> {
  await tundaMock(500);
  const user = bacaUserMock();
  if (!user) throw new Error('BELUM_LOGIN');

  let pesananId = '';
  ubahDb((db) => {
    if (!db.profil[user.id]) throw new Error('PROFIL_BELUM_LENGKAP');
    if (items.length === 0 || items.length > 30) throw new Error('ITEM_TIDAK_VALID');
    if (new Set(items.map((i) => i.menu_id)).size !== items.length) {
      throw new Error('ITEM_TIDAK_VALID');
    }
    if (!Number.isInteger(nomorMeja) || nomorMeja < 1 || nomorMeja > TOTAL_MEJA) {
      throw new Error('MEJA_TIDAK_DITEMUKAN');
    }

    const itemsTagihan = items.map((i) => {
      if (!Number.isInteger(i.qty) || i.qty < 1 || i.qty > 20) throw new Error('QTY_TIDAK_VALID');
      const menu = db.menu.find((m) => m.id === i.menu_id && m.tersedia && !m.diarsipkan);
      if (!menu) throw new Error('MENU_TIDAK_TERSEDIA');
      return { nama_menu: menu.nama, qty: i.qty, harga_satuan: menu.harga };
    });

    let sesi = db.sesi.find((s) => s.nomor_meja === nomorMeja && sesiTerbuka(s));
    if (!sesi) {
      sesi = {
        id: idBaru('sesi'),
        nomor_meja: nomorMeja,
        status: 'aktif',
        metode_bayar: null,
        dibuka_at: new Date().toISOString(),
        minta_bill_at: null,
        ditutup_at: null,
        total_bayar: null,
        dikonfirmasi_oleh: null,
      };
      db.sesi.push(sesi);
    } else if (sesi.status === 'minta_bill') {
      throw new Error('TAGIHAN_SEDANG_DIPROSES');
    }

    const pesanan: MockPesanan = {
      id: idBaru('pesanan'),
      sesi_id: sesi.id,
      pelanggan_id: user.id,
      status: 'baru',
      catatan: catatan.trim() === '' ? null : catatan.trim().slice(0, 140),
      created_at: new Date().toISOString(),
      items: itemsTagihan,
    };
    db.pesanan.push(pesanan);
    pesananId = pesanan.id;
  });
  return pesananId;
}

/** M5: rpc('minta_bill', { p_nomor_meja, p_metode }). Boleh dipanggil ulang untuk ganti metode. */
export async function mintaBill(nomorMeja: number, metode: MetodeBayar): Promise<void> {
  await tundaMock();
  const user = bacaUserMock();
  if (!user) throw new Error('BELUM_LOGIN');

  ubahDb((db) => {
    const sesi = db.sesi.find((s) => s.nomor_meja === nomorMeja && sesiTerbuka(s));
    const sudahPesan =
      sesi && db.pesanan.some((p) => p.sesi_id === sesi.id && p.pelanggan_id === user.id);
    if (!sudahPesan) throw new Error('BUKAN_PEMESAN_MEJA');
    if (!sesi) throw new Error('SESI_TIDAK_AKTIF');
    sesi.status = 'minta_bill';
    sesi.metode_bayar = metode;
    sesi.minta_bill_at = sesi.minta_bill_at ?? new Date().toISOString();
  });
}

/** M5: rpc('get_status_terakhir_meja', { p_nomor_meja, p_sesi_id }) */
export async function fetchStatusTerakhir(
  nomorMeja: number,
  sesiId: string,
): Promise<StatusSesi | null> {
  await tundaMock();
  const sesi = bacaDb().sesi.find((s) => s.id === sesiId && s.nomor_meja === nomorMeja);
  return sesi?.status ?? null;
}
