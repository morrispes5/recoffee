import { getSupabase } from '../../lib/supabase';
import { awalHariJakarta } from '../../lib/waktu';
import type { MetodeBayar } from '../../types/domain';

export interface MenuTerlaris {
  nama_menu: string;
  qty: number;
  omzet: number;
}

export interface RingkasanHariIni {
  /** Total sesi yang sudah dikonfirmasi bayar hari ini. */
  pendapatan: number;
  transaksi: number;
  perMetode: Record<MetodeBayar, number>;
  pesananHariIni: number;
  terlaris: MenuTerlaris[];
}

/** Jumlahkan qty dan omzet per nama menu, urut terbanyak. Dipisah agar mudah dites. */
export function rangkumTerlaris(
  items: { nama_menu: string; qty: number; harga_satuan: number }[],
  batas = 5,
): MenuTerlaris[] {
  const peta = new Map<string, MenuTerlaris>();
  for (const i of items) {
    const ada = peta.get(i.nama_menu) ?? { nama_menu: i.nama_menu, qty: 0, omzet: 0 };
    ada.qty += i.qty;
    ada.omzet += i.qty * i.harga_satuan;
    peta.set(i.nama_menu, ada);
  }
  return [...peta.values()]
    .sort((a, b) => b.qty - a.qty || b.omzet - a.omzet || a.nama_menu.localeCompare(b.nama_menu))
    .slice(0, batas);
}

/**
 * Ringkasan dasbor kasir untuk hari ini (WIB). Hanya admin yang bisa membaca
 * `sesi_meja`, `pesanan`, dan `item_pesanan` (RLS M4), jadi tidak perlu function baru.
 */
export async function fetchRingkasanHariIni(): Promise<RingkasanHariIni> {
  const supabase = getSupabase();
  const mulai = awalHariJakarta().toISOString();

  const [sesi, items, pesanan] = await Promise.all([
    supabase
      .from('sesi_meja')
      .select('total_bayar, metode_bayar')
      .eq('status', 'selesai')
      .gte('ditutup_at', mulai),
    supabase
      .from('item_pesanan')
      .select('nama_menu, qty, harga_satuan, pesanan!inner(created_at)')
      .gte('pesanan.created_at', mulai),
    supabase.from('pesanan').select('id', { count: 'exact', head: true }).gte('created_at', mulai),
  ]);
  if (sesi.error) throw sesi.error;
  if (items.error) throw items.error;
  if (pesanan.error) throw pesanan.error;

  const perMetode: Record<MetodeBayar, number> = { qris: 0, kasir: 0 };
  let pendapatan = 0;
  for (const s of sesi.data) {
    pendapatan += s.total_bayar ?? 0;
    perMetode[s.metode_bayar ?? 'kasir'] += 1;
  }

  return {
    pendapatan,
    transaksi: sesi.data.length,
    perMetode,
    pesananHariIni: pesanan.count ?? 0,
    terlaris: rangkumTerlaris(items.data),
  };
}
