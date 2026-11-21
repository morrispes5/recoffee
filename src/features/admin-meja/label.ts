import { formatRupiah } from '../../lib/format';
import type { MetodeBayar, StatusMejaRow } from '../../types/domain';

export const LABEL_METODE: Record<MetodeBayar, string> = { qris: 'QRIS', kasir: 'Kasir' };

/** Teks status meja, dipakai di bawah lingkaran dan aria-label (status tidak hanya warna). */
export function keteranganMeja(meja: StatusMejaRow): string {
  if (meja.status === 'kosong') return 'Kosong';
  if (meja.status === 'minta_bill') {
    return meja.metode_bayar ? `Minta bill, ${LABEL_METODE[meja.metode_bayar]}` : 'Minta bill';
  }
  return formatRupiah(meja.total);
}
