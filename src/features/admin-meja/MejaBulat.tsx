import { Link } from 'react-router';
import { cn } from '../../lib/cn';
import { formatRupiah } from '../../lib/format';
import type { StatusMejaRow } from '../../types/domain';
import { keteranganMeja } from './label';

const LINGKARAN =
  'grid size-16 place-items-center rounded-full font-display text-[1.6rem] leading-none tabular-nums sm:size-[4.5rem]';

/** Satu meja di denah (PRD 16.6). Meja kosong tidak bisa diklik. */
export function MejaBulat({ meja }: { meja: StatusMejaRow }) {
  const keterangan = keteranganMeja(meja);

  if (meja.status === 'kosong') {
    return (
      <div className="flex flex-col items-center gap-2" aria-label={`Meja ${meja.nomor}, kosong`}>
        <span className={cn(LINGKARAN, 'border border-garis text-ampas')}>{meja.nomor}</span>
        <span className="text-body-s text-ampas">{keterangan}</span>
      </div>
    );
  }

  const mintaBill = meja.status === 'minta_bill';
  const label = mintaBill
    ? `Meja ${meja.nomor}, ${keterangan.toLowerCase()}, total ${formatRupiah(meja.total)}`
    : `Meja ${meja.nomor}, terisi, total ${formatRupiah(meja.total)}`;

  return (
    <Link
      to={`/admin/meja/${meja.nomor}`}
      aria-label={label}
      className="group flex flex-col items-center gap-2 rounded-ui py-1"
    >
      <span
        className={cn(
          LINGKARAN,
          'transition-transform duration-200 group-hover:scale-105 group-active:scale-95',
          mintaBill ? 'animate-denyut bg-lampu text-tubruk' : 'bg-blirik text-putih',
        )}
      >
        {meja.nomor}
      </span>
      <span
        className={cn(
          'text-center text-body-s tabular-nums',
          mintaBill ? 'font-semibold text-tubruk' : 'text-tubruk',
        )}
      >
        {keterangan}
      </span>
    </Link>
  );
}
