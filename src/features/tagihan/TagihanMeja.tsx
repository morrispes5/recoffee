import { Storefront } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CangkirTubruk } from '../../components/brand/icons';
import { Button, buttonClass, InlineMessage, Skeleton } from '../../components/ui';
import { toUserMessage } from '../../lib/errors';
import type { Tagihan } from '../../types/domain';
import { useStatusTerakhir, useTagihan } from './hooks';
import { MintaBillDialog } from './MintaBillDialog';
import { QrisPanel } from './QrisPanel';
import { bacaSesiTerakhir, simpanSesiTerakhir } from './sesiStorage';
import { TagihanView } from './TagihanView';

/** Isi halaman tagihan untuk user yang sudah login (PRD 16.4). */
export function TagihanMeja({ nomor }: { nomor: number }) {
  const tagihanQ = useTagihan(nomor, true);
  const tagihan = tagihanQ.data;

  useEffect(() => {
    if (tagihan) simpanSesiTerakhir(nomor, tagihan.sesi_id);
  }, [tagihan, nomor]);

  // Tagihan kosong: cek apakah sesi yang terakhir dilihat di tab ini sudah ditutup kasir.
  const sesiTerakhir = tagihan === null ? bacaSesiTerakhir(nomor) : null;
  const statusQ = useStatusTerakhir(nomor, sesiTerakhir);

  if (tagihanQ.isPending) return <Skeleton lines={6} label="Memuat tagihan" />;

  if (tagihanQ.isError && tagihan === undefined) {
    return (
      <InlineMessage
        tone="error"
        action={
          <Button variant="ghost" className="-my-2" onClick={() => void tagihanQ.refetch()}>
            Coba lagi
          </Button>
        }
      >
        {toUserMessage(tagihanQ.error)}
      </InlineMessage>
    );
  }

  if (!tagihan) {
    if (sesiTerakhir && statusQ.isPending) return <Skeleton lines={3} label="Memuat" />;
    if (statusQ.data === 'selesai') return <TerimaKasih nomor={nomor} />;
    if (statusQ.data === 'batal') {
      return (
        <Kosong nomor={nomor} judul="Tagihan meja ini sudah ditutup kasir." teksLink="Ke menu" />
      );
    }
    return <Kosong nomor={nomor} judul="Belum ada pesanan di meja ini." teksLink="Pilih menu" />;
  }

  return <TagihanAktif nomor={nomor} tagihan={tagihan} />;
}

function TagihanAktif({ nomor, tagihan }: { nomor: number; tagihan: Tagihan }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [baruDiminta, setBaruDiminta] = useState(false);
  const pemesan = tagihan.pesanan.some((p) => p.milik_saya);

  return (
    <div className="flex flex-col gap-8">
      <TagihanView tagihan={tagihan} />

      {tagihan.status === 'aktif' ? (
        pemesan ? (
          <Button fullWidth onClick={() => setDialogOpen(true)}>
            Minta bill
          </Button>
        ) : (
          <p className="text-body-s text-ampas">
            Minta bill bisa dilakukan oleh yang sudah memesan di meja ini.
          </p>
        )
      ) : (
        <div className="flex flex-col gap-5">
          {baruDiminta ? (
            <InlineMessage tone="sukses">Bill diminta. Kasir akan segera memproses.</InlineMessage>
          ) : null}
          {tagihan.metode_bayar === 'qris' ? (
            <QrisPanel total={tagihan.total} />
          ) : (
            <section className="flex items-start gap-4 rounded-ui border border-garis px-5 py-5">
              <Storefront size={28} className="shrink-0 text-tubruk" aria-hidden="true" />
              <div>
                <h2 className="text-body-l font-semibold">Bayar di kasir</h2>
                <p className="mt-1 text-ampas">Silakan ke kasir dan sebut meja {nomor}.</p>
              </div>
            </section>
          )}
          {pemesan ? (
            <Button variant="secondary" onClick={() => setDialogOpen(true)}>
              Ganti cara bayar
            </Button>
          ) : null}
        </div>
      )}

      <MintaBillDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        nomorMeja={nomor}
        total={tagihan.total}
        onBerhasil={() => setBaruDiminta(true)}
      />
    </div>
  );
}

function TerimaKasih({ nomor }: { nomor: number }) {
  return (
    <section className="flex flex-col items-start gap-4 pt-4" role="status">
      <CangkirTubruk size={48} className="text-blirik" />
      <h2 className="font-display text-display-m">Pembayaran sudah dikonfirmasi.</h2>
      <p className="text-ampas">Terima kasih sudah mampir.</p>
      <Link to={`/meja/${nomor}`} className={buttonClass('secondary')}>
        Kembali ke menu
      </Link>
    </section>
  );
}

function Kosong({ nomor, judul, teksLink }: { nomor: number; judul: string; teksLink: string }) {
  return (
    <section className="flex flex-col items-start gap-4 pt-4">
      <CangkirTubruk size={48} className="text-ampas" />
      <p className="text-body-l">{judul}</p>
      <Link to={`/meja/${nomor}`} className={buttonClass('secondary')}>
        {teksLink}
      </Link>
    </section>
  );
}
