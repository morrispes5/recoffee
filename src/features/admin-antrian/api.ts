import { getSupabase } from '../../lib/supabase';
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
 * Pesanan baru dan diproses, urut dari yang terlama (FR-16). Pesanan dari sesi yang dibatalkan
 * tidak ikut: barista tidak perlu membuat pesanan yang kasir sudah batalkan (temuan uji M6).
 */
export async function fetchAntrian(): Promise<AntrianRow[]> {
  const { data, error } = await getSupabase()
    .from('pesanan')
    .select(
      'id, status, catatan, created_at, sesi_meja!inner(nomor_meja), pelanggan(nama), items:item_pesanan(nama_menu, qty)',
    )
    .in('status', ['baru', 'diproses'])
    .neq('sesi_meja.status', 'batal')
    .order('created_at')
    .order('id');
  if (error) throw error;
  return data.flatMap(({ id, status, catatan, created_at, sesi_meja, pelanggan, items }) => {
    if (!sesi_meja || status === 'diantar') return [];
    return [
      {
        id,
        status,
        catatan,
        created_at,
        nomor_meja: sesi_meja.nomor_meja,
        pelanggan_nama: pelanggan?.nama ?? 'Pelanggan',
        items,
      },
    ];
  });
}

export const LANGKAH_BERIKUTNYA: Record<StatusAntrian, { ke: StatusPesanan; aksi: string }> = {
  baru: { ke: 'diproses', aksi: 'Proses' },
  diproses: { ke: 'diantar', aksi: 'Antar' },
};

export async function ubahStatusPesanan(
  id: string,
  dari: StatusAntrian,
  ke: StatusPesanan,
): Promise<void> {
  if (LANGKAH_BERIKUTNYA[dari].ke !== ke) throw new Error('TRANSISI_STATUS_TIDAK_VALID');

  const { data, error } = await getSupabase()
    .from('pesanan')
    .update({ status: ke })
    .eq('id', id)
    .eq('status', dari)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('TRANSISI_STATUS_TIDAK_VALID');
}
