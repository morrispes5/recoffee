import { AnimatePresence, m } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { CangkirTubruk } from '../../components/brand/icons';
import { Button, InlineMessage, Skeleton } from '../../components/ui';
import { cn } from '../../lib/cn';
import { toUserMessage } from '../../lib/errors';
import { notify } from '../../lib/notify';
import { formatJam } from '../../lib/format';
import { StatusPesananBadge } from '../tagihan/StatusPesananBadge';
import { LANGKAH_BERIKUTNYA, type StatusAntrian } from './api';
import { useAntrian, useUbahStatusPesanan } from './hooks';

type Filter = 'semua' | StatusAntrian;

const FILTER: { value: Filter; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  { value: 'baru', label: 'Baru' },
  { value: 'diproses', label: 'Diproses' },
];

/** Antrian pesanan untuk barista, urut dari yang terlama (FR-16, FR-17, PRD 16.8). */
export function AntrianList() {
  const antrianQ = useAntrian();
  const ubah = useUbahStatusPesanan();
  const [filter, setFilter] = useState<Filter>('semua');

  if (antrianQ.isPending) return <Skeleton lines={6} label="Memuat antrian" />;
  if (antrianQ.isError) {
    return (
      <InlineMessage
        tone="error"
        action={
          <Button variant="ghost" className="-my-2" onClick={() => void antrianQ.refetch()}>
            Coba lagi
          </Button>
        }
      >
        {toUserMessage(antrianQ.error)}
      </InlineMessage>
    );
  }

  const semua = antrianQ.data;
  const jumlah = (f: Filter) =>
    f === 'semua' ? semua.length : semua.filter((r) => r.status === f).length;
  const rows = filter === 'semua' ? semua : semua.filter((r) => r.status === filter);
  const sedangDiubah = ubah.isPending ? ubah.variables.id : null;

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Saring status" className="flex flex-wrap gap-2">
        {FILTER.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-body-s font-medium transition-colors duration-150',
              filter === f.value
                ? 'border-tubruk bg-tubruk text-putih'
                : 'border-garis bg-putih text-tubruk hover:border-tubruk',
            )}
          >
            {f.label}
            <span className="tabular-nums opacity-80">{jumlah(f.value)}</span>
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="flex animate-muncul items-center gap-4 rounded-ui border border-garis bg-putih px-5 py-8 text-ampas">
          <CangkirTubruk size={36} />
          <p>
            {semua.length === 0
              ? 'Antrian kosong. Pesanan baru akan muncul di sini.'
              : 'Tidak ada pesanan dengan status ini.'}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-garis overflow-hidden rounded-ui border border-garis bg-putih">
          <AnimatePresence initial={false}>
            {rows.map((r) => {
              const langkah = LANGKAH_BERIKUTNYA[r.status];
              return (
                <m.li
                  key={r.id}
                  layout
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 48 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className={cn(
                    'grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-2 border-l-4 px-4 py-4 sm:px-5 md:grid-cols-[4rem_5.5rem_8rem_minmax(0,1fr)_6.5rem_7rem] md:items-center',
                    r.status === 'baru' ? 'border-l-blirik' : 'border-l-transparent',
                  )}
                >
                  <span className="text-body-s text-ampas tabular-nums md:text-body">
                    {formatJam(r.created_at)}
                  </span>
                  <span className="flex flex-wrap gap-x-3 md:contents">
                    <Link
                      to={`/admin/meja/${r.nomor_meja}`}
                      className="font-semibold underline-offset-2 hover:underline"
                    >
                      Meja {r.nomor_meja}
                    </Link>
                    <span className="truncate text-ampas md:text-tubruk">{r.pelanggan_nama}</span>
                  </span>
                  <span className="row-span-2 md:hidden">
                    <StatusPesananBadge status={r.status} />
                  </span>
                  <span className="col-span-2 col-start-1 md:col-span-1 md:col-start-auto">
                    {r.items.map((i) => `${i.qty} × ${i.nama_menu}`).join(', ')}
                    {r.catatan ? (
                      <span className="block text-body-s text-ampas">Catatan: {r.catatan}</span>
                    ) : null}
                  </span>
                  <span className="hidden md:block">
                    <StatusPesananBadge status={r.status} />
                  </span>
                  <Button
                    variant={r.status === 'baru' ? 'primary' : 'secondary'}
                    className="col-span-3 md:col-span-1"
                    loading={sedangDiubah === r.id}
                    disabled={sedangDiubah !== null}
                    onClick={() =>
                      ubah.mutate(
                        { id: r.id, dari: r.status, ke: langkah.ke },
                        {
                          onSuccess: () =>
                            notify.success(
                              r.status === 'baru'
                                ? `Pesanan meja ${r.nomor_meja} sedang diproses`
                                : `Pesanan meja ${r.nomor_meja} diantar`,
                              r.status === 'baru' ? 'Selamat meracik!' : 'Selamat menikmati.',
                            ),
                          onError: (error) => notify.error('Status pesanan gagal diubah', error),
                        },
                      )
                    }
                  >
                    {langkah.aksi}
                  </Button>
                </m.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
