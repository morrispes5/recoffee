import { z } from 'zod';
import { getSupabase } from '../../lib/supabase';
import type { MetodeBayar, StatusSesi, Tagihan } from '../../types/domain';

/** Yang dikirim frontend hanya menu_id + qty. Harga diambil dari database. */
export interface ItemKirim {
  menu_id: string;
  qty: number;
}

// RPC get_tagihan_meja mengembalikan jsonb, sehingga tipe hasilnya diperiksa di sini.
const tagihanSchema = z.object({
  sesi_id: z.uuid(),
  nomor_meja: z.number().int(),
  status: z.enum(['aktif', 'minta_bill']),
  metode_bayar: z.enum(['qris', 'kasir']).nullable(),
  dibuka_at: z.string(),
  total: z.number().int(),
  pesanan: z.array(
    z.object({
      id: z.uuid(),
      status: z.enum(['baru', 'diproses', 'diantar']),
      catatan: z.string().nullable(),
      dipesan_oleh: z.string(),
      milik_saya: z.boolean(),
      created_at: z.string(),
      items: z.array(
        z.object({
          nama_menu: z.string(),
          qty: z.number().int(),
          harga_satuan: z.number().int(),
        }),
      ),
    }),
  ),
});

export async function fetchTagihan(nomorMeja: number): Promise<Tagihan | null> {
  const { data, error } = await getSupabase().rpc('get_tagihan_meja', { p_nomor_meja: nomorMeja });
  if (error) throw error;
  return data === null ? null : tagihanSchema.parse(data);
}

export async function kirimPesanan(
  nomorMeja: number,
  items: ItemKirim[],
  catatan: string,
): Promise<string> {
  const { data, error } = await getSupabase().rpc('buat_pesanan', {
    p_nomor_meja: nomorMeja,
    p_items: items.map(({ menu_id, qty }) => ({ menu_id, qty })),
    p_catatan: catatan,
  });
  if (error) throw error;
  return data;
}

export async function mintaBill(nomorMeja: number, metode: MetodeBayar): Promise<void> {
  const { error } = await getSupabase().rpc('minta_bill', {
    p_nomor_meja: nomorMeja,
    p_metode: metode,
  });
  if (error) throw error;
}

export async function fetchStatusTerakhir(
  nomorMeja: number,
  sesiId: string,
): Promise<StatusSesi | null> {
  const { data, error } = await getSupabase().rpc('get_status_terakhir_meja', {
    p_nomor_meja: nomorMeja,
    p_sesi_id: sesiId,
  });
  if (error) throw error;
  return data;
}
