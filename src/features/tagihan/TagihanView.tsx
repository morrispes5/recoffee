import { formatJam, formatRupiah } from '../../lib/format';
import type { Tagihan } from '../../types/domain';
import { StatusPesananBadge } from './StatusPesananBadge';

/** Daftar pesanan dalam satu sesi meja + total (FR-07). Nomor HP tidak pernah tampil (NFR-11). */
export function TagihanView({ tagihan }: { tagihan: Tagihan }) {
  return (
    <div>
      <p className="text-body-s text-ampas">Dibuka {formatJam(tagihan.dibuka_at)}</p>

      <ol className="mt-8 flex flex-col divide-y divide-garis border-y border-garis">
        {tagihan.pesanan.map((p, i) => (
          <li key={p.id} className="py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">Pesanan {i + 1}</p>
                <p className="text-body-s text-ampas">
                  {formatJam(p.created_at)} oleh {p.dipesan_oleh}
                  {p.milik_saya ? ' (kamu)' : ''}
                </p>
              </div>
              <StatusPesananBadge status={p.status} />
            </div>
            <ul className="mt-3 flex flex-col gap-1">
              {p.items.map((item) => (
                <li key={item.nama_menu} className="flex justify-between gap-3">
                  <span>
                    <span className="tabular-nums">{item.qty}</span> × {item.nama_menu}
                  </span>
                  <span className="whitespace-nowrap tabular-nums">
                    {formatRupiah(item.qty * item.harga_satuan)}
                  </span>
                </li>
              ))}
            </ul>
            {p.catatan ? <p className="mt-2 text-body-s text-ampas">Catatan: {p.catatan}</p> : null}
          </li>
        ))}
      </ol>

      <div className="mt-6 flex items-baseline justify-between gap-4">
        <span className="text-body-l">Total</span>
        <span className="font-display text-display-l tabular-nums">
          {formatRupiah(tagihan.total)}
        </span>
      </div>
    </div>
  );
}
