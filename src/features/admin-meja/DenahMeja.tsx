import { KursiPlastik } from '../../components/brand/icons';
import { Button, InlineMessage, Skeleton } from '../../components/ui';
import { toUserMessage } from '../../lib/errors';
import { useDenah } from './hooks';
import { MejaBulat } from './MejaBulat';

/** Denah 28 meja + keterangan (FR-12, FR-21). Angka ringkasan ada di kartu dasbor. */
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

  return (
    <div className="flex flex-col gap-8">
      {terisi === 0 ? (
        <p className="flex items-center gap-3 rounded-ui bg-tegel px-4 py-3 text-body-s text-ampas">
          <KursiPlastik size={24} />
          Semua meja kosong. Pesanan pertama akan membuka meja otomatis.
        </p>
      ) : null}

      <ul className="grid grid-cols-4 gap-x-3 gap-y-6 sm:grid-cols-7">
        {meja.map((m, i) => (
          <li
            key={m.nomor}
            className="flex animate-muncul justify-center"
            style={{ animationDelay: `${120 + i * 15}ms` }}
          >
            <MejaBulat meja={m} />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-garis pt-4 text-body-s text-ampas">
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
