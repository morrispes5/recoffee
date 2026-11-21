import { KursiPlastik } from '../../components/brand/icons';
import { Button, InlineMessage, Skeleton } from '../../components/ui';
import { toUserMessage } from '../../lib/errors';
import { useDenah } from './hooks';
import { MejaBulat } from './MejaBulat';

/** Denah 28 meja + ringkasan + keterangan (FR-12, FR-21). */
export function DenahMeja() {
  const denahQ = useDenah();

  if (denahQ.isPending) return <Skeleton lines={6} label="Memuat denah" className="max-w-xl" />;

  if (denahQ.isError) {
    return (
      <InlineMessage
        tone="error"
        action={
          <Button variant="ghost" className="-my-2" onClick={() => void denahQ.refetch()}>
            Coba lagi
          </Button>
        }
      >
        {toUserMessage(denahQ.error)}
      </InlineMessage>
    );
  }

  const meja = denahQ.data;
  const terisi = meja.filter((m) => m.status !== 'kosong').length;
  const mintaBill = meja.filter((m) => m.status === 'minta_bill').length;
  const belumDiantar = meja.reduce((sum, m) => sum + m.pesanan_belum_diantar, 0);

  return (
    <div className="flex flex-col gap-10">
      <p className="flex flex-wrap gap-x-8 gap-y-1 text-body-l" aria-live="polite">
        <span>
          <span className="font-semibold tabular-nums">{terisi}</span> meja terisi
        </span>
        <span>
          <span className="font-semibold tabular-nums">{mintaBill}</span> minta bill
        </span>
        <span>
          <span className="font-semibold tabular-nums">{belumDiantar}</span> pesanan belum diantar
        </span>
      </p>

      {terisi === 0 ? (
        <p className="flex items-center gap-3 text-ampas">
          <KursiPlastik size={28} />
          Semua meja kosong. Pesanan pertama akan membuka meja otomatis.
        </p>
      ) : null}

      <ul className="grid max-w-[60rem] grid-cols-4 gap-x-4 gap-y-8 lg:grid-cols-7">
        {meja.map((m) => (
          <li key={m.nomor} className="flex justify-center">
            <MejaBulat meja={m} />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-s text-ampas">
        <span className="font-medium text-tubruk">Keterangan</span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-4 rounded-full border border-garis" />
          Kosong
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-4 rounded-full bg-blirik" />
          Terisi, angka = total berjalan
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-4 rounded-full bg-lampu" />
          Minta bill
        </span>
      </div>
    </div>
  );
}
