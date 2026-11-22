import { CaretRight, Receipt } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { formatRupiah } from '../../lib/format';
import { lamaSejak } from '../../lib/waktu';
import type { StatusMejaRow } from '../../types/domain';
import { LABEL_METODE } from '../admin-meja/label';

/** Meja yang sudah minta bill, yang paling lama menunggu di atas. */
export function PerluDitagih({ meja, now }: { meja: StatusMejaRow[]; now: Date }) {
  const daftar = meja
    .filter((m) => m.status === 'minta_bill')
    .sort((a, b) => (a.minta_bill_at ?? '').localeCompare(b.minta_bill_at ?? ''));

  if (daftar.length === 0) {
    return (
      <p className="flex items-center gap-3 rounded-ui bg-tegel px-4 py-4 text-body-s text-ampas">
        <Receipt size={20} aria-hidden="true" />
        Belum ada meja yang minta bill.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {daftar.map((m, i) => (
        <li key={m.nomor} className="animate-muncul" style={{ animationDelay: `${i * 60}ms` }}>
          <Link
            to={`/admin/meja/${m.nomor}`}
            className="group flex items-center gap-4 rounded-ui border border-lampu/60 bg-lampu/10 px-4 py-3 transition-colors hover:bg-lampu/25"
          >
            <span className="grid size-11 shrink-0 animate-denyut place-items-center rounded-full bg-lampu font-display text-[1.25rem] tabular-nums">
              {m.nomor}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold tabular-nums">{formatRupiah(m.total)}</span>
              <span className="block text-body-s text-ampas">
                {m.metode_bayar ? LABEL_METODE[m.metode_bayar] : 'Metode belum dipilih'}
                {m.minta_bill_at ? `, menunggu ${lamaSejak(m.minta_bill_at, now)}` : ''}
              </span>
            </span>
            <CaretRight
              size={18}
              aria-hidden="true"
              className="text-ampas transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
