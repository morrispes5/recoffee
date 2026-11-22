import { ArrowRight } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '../../lib/cn';
import { formatRupiah } from '../../lib/format';
import { useCountUp } from '../../lib/useCountUp';

type Tone = 'netral' | 'blirik' | 'lampu';

const IKON_TONE: Record<Tone, string> = {
  netral: 'bg-tegel text-tubruk',
  blirik: 'bg-blirik text-putih',
  lampu: 'bg-lampu text-tubruk',
};

/** Kartu angka utama di dasbor kasir; angka berjalan saat berubah. */
export function StatCard({
  label,
  nilai,
  rupiah = false,
  ikon,
  keterangan,
  tone = 'netral',
  to,
  delay = 0,
  sorot = false,
}: {
  label: string;
  nilai: number;
  rupiah?: boolean;
  ikon: ReactNode;
  keterangan: ReactNode;
  tone?: Tone;
  to?: string;
  delay?: number;
  /** Beri garis tepi lampu, misalnya saat ada meja yang menunggu bill. */
  sorot?: boolean;
}) {
  const tampil = useCountUp(nilai);
  return (
    <article
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        'animate-muncul flex flex-col gap-4 rounded-ui border bg-putih p-5 transition-colors duration-300',
        sorot ? 'border-lampu' : 'border-garis',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-body-s font-semibold text-ampas">{label}</h2>
        <span
          aria-hidden="true"
          className={cn('grid size-10 place-items-center rounded-full', IKON_TONE[tone])}
        >
          {ikon}
        </span>
      </div>
      <p className="font-display text-display-l tabular-nums" aria-live="polite">
        {rupiah ? formatRupiah(tampil) : tampil}
      </p>
      <div className="mt-auto flex items-end justify-between gap-3 text-body-s text-ampas">
        <span>{keterangan}</span>
        {to ? (
          <Link
            to={to}
            aria-label={`Buka ${label.toLowerCase()}`}
            className="group grid size-8 shrink-0 place-items-center rounded-full border border-garis text-tubruk transition-colors hover:border-tubruk"
          >
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
