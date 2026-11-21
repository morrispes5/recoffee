import { bacaDb, bacaUserMock, sesiTerbuka, tundaMock, ubahDb, type MockDb } from '../../mocks/db';
import { TOTAL_MEJA } from '../../lib/meja';
import type {
  ItemTagihan,
  MetodeBayar,
  StatusMejaRow,
  StatusPesanan,
  StatusSesi,
} from '../../types/domain';

export interface PesananDetail {
  id: string;
  status: StatusPesanan;
  catatan: string | null;
  created_at: string;
  pelanggan: { nama: string; no_hp: string };
  items: ItemTagihan[];
}

export interface DetailMeja {
  sesi_id: string;
  nomor_meja: number;
  status: Extract<StatusSesi, 'aktif' | 'minta_bill'>;
  metode_bayar: MetodeBayar | null;
  dibuka_at: string;
  minta_bill_at: string | null;
  total: number;
  pesanan: PesananDetail[];
}

function totalSesi(db: MockDb, sesiId: string): number {
  return db.pesanan
    .filter((p) => p.sesi_id === sesiId)
    .flatMap((p) => p.items)
    .reduce((sum, i) => sum + i.qty * i.harga_satuan, 0);
}

/** M5: from('v_status_meja').select('*').order('nomor') */
export async function fetchDenah(): Promise<StatusMejaRow[]> {
  await tundaMock();
  const db = bacaDb();
  return Array.from({ length: TOTAL_MEJA }, (_, i) => {
    const nomor = i + 1;
    const sesi = db.sesi.find((s) => s.nomor_meja === nomor && sesiTerbuka(s));
    if (!sesi || !sesiTerbuka(sesi)) {
      return {
        nomor,
        kapasitas: 4,
        sesi_id: null,
        status: 'kosong',
        metode_bayar: null,
        dibuka_at: null,
        minta_bill_at: null,
        total: 0,
        pesanan_belum_diantar: 0,
      };
    }
    return {
      nomor,
      kapasitas: 4,
      sesi_id: sesi.id,
      status: sesi.status,
      metode_bayar: sesi.metode_bayar,
      dibuka_at: sesi.dibuka_at,
      minta_bill_at: sesi.minta_bill_at,
      total: totalSesi(db, sesi.id),
      pesanan_belum_diantar: db.pesanan.filter(
        (p) => p.sesi_id === sesi.id && p.status !== 'diantar',
      ).length,
    };
  });
}

/** M5: from('sesi_meja').select('*, pesanan(*, pelanggan(nama, no_hp), item_pesanan(*))') */
export async function fetchDetailMeja(nomor: number): Promise<DetailMeja | null> {
  await tundaMock();
  const db = bacaDb();
  const sesi = db.sesi.find((s) => s.nomor_meja === nomor && sesiTerbuka(s));
  if (!sesi || !sesiTerbuka(sesi)) return null;
  return {
    sesi_id: sesi.id,
    nomor_meja: nomor,
    status: sesi.status,
    metode_bayar: sesi.metode_bayar,
    dibuka_at: sesi.dibuka_at,
    minta_bill_at: sesi.minta_bill_at,
    total: totalSesi(db, sesi.id),
    pesanan: db.pesanan
      .filter((p) => p.sesi_id === sesi.id)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((p) => ({
        id: p.id,
        status: p.status,
        catatan: p.catatan,
        created_at: p.created_at,
        pelanggan: {
          nama: db.profil[p.pelanggan_id]?.nama ?? 'Pelanggan',
          no_hp: db.profil[p.pelanggan_id]?.no_hp ?? '-',
        },
        items: p.items,
      })),
  };
}

/** M5: rpc('konfirmasi_bayar', { p_sesi_id, p_metode }). Total dibekukan saat ditutup. */
export async function konfirmasiBayar(sesiId: string, metode: MetodeBayar | null): Promise<void> {
  await tundaMock(500);
  const admin = bacaUserMock();
  ubahDb((db) => {
    const sesi = db.sesi.find((s) => s.id === sesiId && sesiTerbuka(s));
    if (!sesi) throw new Error('SESI_TIDAK_AKTIF');
    sesi.status = 'selesai';
    sesi.metode_bayar = metode ?? sesi.metode_bayar ?? 'kasir';
    sesi.total_bayar = totalSesi(db, sesi.id);
    sesi.ditutup_at = new Date().toISOString();
    sesi.dikonfirmasi_oleh = admin?.email ?? 'kasir.demo@gmail.com';
  });
}

/** M5: rpc('batalkan_sesi', { p_sesi_id }). Pesanan tetap tercatat (BR-08). */
export async function batalkanSesi(sesiId: string): Promise<void> {
  await tundaMock(500);
  const admin = bacaUserMock();
  ubahDb((db) => {
    const sesi = db.sesi.find((s) => s.id === sesiId && sesiTerbuka(s));
    if (!sesi) throw new Error('SESI_TIDAK_AKTIF');
    sesi.status = 'batal';
    sesi.ditutup_at = new Date().toISOString();
    sesi.dikonfirmasi_oleh = admin?.email ?? 'kasir.demo@gmail.com';
  });
}
