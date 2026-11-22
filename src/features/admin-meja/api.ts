import { getSupabase } from '../../lib/supabase';
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

export async function fetchDenah(): Promise<StatusMejaRow[]> {
  const { data, error } = await getSupabase().from('v_status_meja').select('*').order('nomor');
  if (error) throw error;
  return data.map((row) => {
    const { nomor, kapasitas, status, total, pesanan_belum_diantar } = row;
    if (
      nomor === null ||
      kapasitas === null ||
      total === null ||
      pesanan_belum_diantar === null ||
      (status !== 'kosong' && status !== 'aktif' && status !== 'minta_bill')
    ) {
      throw new Error('Status meja tidak valid.');
    }
    return { ...row, nomor, kapasitas, status, total, pesanan_belum_diantar };
  });
}

export async function fetchDetailMeja(nomor: number): Promise<DetailMeja | null> {
  const { data, error } = await getSupabase()
    .from('sesi_meja')
    .select(
      'id, nomor_meja, status, metode_bayar, dibuka_at, minta_bill_at, pesanan(id, status, catatan, created_at, pelanggan(nama, no_hp), items:item_pesanan(nama_menu, qty, harga_satuan))',
    )
    .eq('nomor_meja', nomor)
    .in('status', ['aktif', 'minta_bill'])
    .order('created_at', { referencedTable: 'pesanan' })
    .maybeSingle();
  if (error) throw error;
  if (!data || (data.status !== 'aktif' && data.status !== 'minta_bill')) return null;

  const { id, status, nomor_meja, metode_bayar, dibuka_at, minta_bill_at } = data;
  const pesanan = data.pesanan.map((order) => ({
    ...order,
    pelanggan: order.pelanggan ?? { nama: 'Pelanggan', no_hp: '-' },
  }));
  const total = pesanan.flatMap((p) => p.items).reduce((sum, i) => sum + i.qty * i.harga_satuan, 0);
  return {
    sesi_id: id,
    nomor_meja,
    status,
    metode_bayar,
    dibuka_at,
    minta_bill_at,
    total,
    pesanan,
  };
}

export async function konfirmasiBayar(sesiId: string, metode: MetodeBayar | null): Promise<void> {
  const { error } = await getSupabase().rpc('konfirmasi_bayar', {
    p_sesi_id: sesiId,
    p_metode: metode ?? undefined,
  });
  if (error) throw error;
}

export async function batalkanSesi(sesiId: string): Promise<void> {
  const { error } = await getSupabase().rpc('batalkan_sesi', { p_sesi_id: sesiId });
  if (error) throw error;
}
