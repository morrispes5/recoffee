import { bacaDb, tundaMock, ubahDb } from '../../mocks/db';
import type { StatusPesanan } from '../../types/domain';

export type StatusAntrian = Extract<StatusPesanan, 'baru' | 'diproses'>;

export interface AntrianRow {
  id: string;
  status: StatusAntrian;
  catatan: string | null;
  created_at: string;
  nomor_meja: number;
  pelanggan_nama: string;
  items: { nama_menu: string; qty: number }[];
}

/**
 * Pesanan baru dan diproses, urut dari yang terlama (FR-16).
 * M5: from('pesanan').select('id, status, catatan, created_at, sesi_meja(nomor_meja),
 *     pelanggan(nama), item_pesanan(nama_menu, qty)').in('status', ['baru','diproses']).order('created_at')
 */
export async function fetchAntrian(): Promise<AntrianRow[]> {
  await tundaMock();
  const db = bacaDb();
  const rows: AntrianRow[] = [];
  for (const p of db.pesanan) {
    if (p.status === 'diantar') continue;
    const sesi = db.sesi.find((s) => s.id === p.sesi_id);
    if (!sesi) continue;
    rows.push({
      id: p.id,
      status: p.status,
      catatan: p.catatan,
      created_at: p.created_at,
      nomor_meja: sesi.nomor_meja,
      pelanggan_nama: db.profil[p.pelanggan_id]?.nama ?? 'Pelanggan',
      items: p.items.map(({ nama_menu, qty }) => ({ nama_menu, qty })),
    });
  }
  return rows.sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export const LANGKAH_BERIKUTNYA: Record<StatusAntrian, { ke: StatusPesanan; aksi: string }> = {
  baru: { ke: 'diproses', aksi: 'Proses' },
  diproses: { ke: 'diantar', aksi: 'Antar' },
};

/**
 * Maju satu langkah saja; trigger database menolak lompatan (TRANSISI_STATUS_TIDAK_VALID).
 * M5: from('pesanan').update({ status }).eq('id', id)
 */
export async function ubahStatusPesanan(
  id: string,
  dari: StatusAntrian,
  ke: StatusPesanan,
): Promise<void> {
  await tundaMock();
  ubahDb((db) => {
    const p = db.pesanan.find((x) => x.id === id);
    if (!p || p.status !== dari || LANGKAH_BERIKUTNYA[dari].ke !== ke) {
      throw new Error('TRANSISI_STATUS_TIDAK_VALID');
    }
    p.status = ke;
  });
}
