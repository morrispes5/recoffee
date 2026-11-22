import { Phone } from '@phosphor-icons/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { KursiPlastik } from '../../components/brand/icons';
import {
  Badge,
  Button,
  buttonClass,
  Dialog,
  InlineMessage,
  Select,
  Skeleton,
} from '../../components/ui';
import { showAlert } from '../../lib/alertStore';
import { celebrate } from '../../lib/celebrate';
import { toUserMessage } from '../../lib/errors';
import { formatJam, formatRupiah } from '../../lib/format';
import { notify } from '../../lib/notify';
import type { MetodeBayar } from '../../types/domain';
import { StatusPesananBadge } from '../tagihan/StatusPesananBadge';
import type { DetailMeja as DetailMejaData } from './api';
import { useBatalkanSesi, useDetailMeja, useKonfirmasiBayar } from './hooks';
import { LABEL_METODE } from './label';

/** Detail tagihan satu meja untuk kasir (FR-13, FR-14, FR-15, PRD 16.7). */
export function DetailMeja({ nomor }: { nomor: number }) {
  const detailQ = useDetailMeja(nomor);

  if (detailQ.isPending) return <Skeleton lines={8} label="Memuat detail meja" />;

  if (detailQ.isError) {
    return (
      <InlineMessage
        tone="error"
        action={
          <Button variant="ghost" className="-my-2" onClick={() => void detailQ.refetch()}>
            Coba lagi
          </Button>
        }
      >
        {toUserMessage(detailQ.error)}
      </InlineMessage>
    );
  }

  if (detailQ.data === null) {
    return (
      <div className="flex animate-muncul flex-col items-start gap-4 rounded-ui border border-garis bg-putih p-6">
        <KursiPlastik size={40} className="text-ampas" />
        <p className="text-body-l">Meja {nomor} sedang kosong.</p>
        <Link to="/admin" className={buttonClass('secondary')}>
          Kembali ke denah
        </Link>
      </div>
    );
  }

  return <DetailMejaIsi detail={detailQ.data} />;
}

function DetailMejaIsi({ detail }: { detail: DetailMejaData }) {
  const navigate = useNavigate();
  const konfirmasi = useKonfirmasiBayar();
  const batalkan = useBatalkanSesi();
  // null = ikuti pilihan pelanggan (atau kasir bila belum memilih)
  const [metodePilihan, setMetodePilihan] = useState<MetodeBayar | null>(null);
  const [dialog, setDialog] = useState<'konfirmasi' | 'batal' | null>(null);

  const metode: MetodeBayar = metodePilihan ?? detail.metode_bayar ?? 'kasir';
  const belumDiantar = detail.pesanan.filter((p) => p.status !== 'diantar').length;
  const nomor = detail.nomor_meja;

  function tutupDialog() {
    if (konfirmasi.isPending || batalkan.isPending) return;
    konfirmasi.reset();
    batalkan.reset();
    setDialog(null);
  }

  function jalankanKonfirmasi() {
    konfirmasi.mutate(
      { sesiId: detail.sesi_id, metode },
      {
        onSuccess: () => {
          void navigate('/admin');
          notify.success(
            `Pembayaran meja ${nomor} dikonfirmasi`,
            `${formatRupiah(detail.total)} lewat ${LABEL_METODE[metode]}. Meja kosong lagi.`,
          );
          // Tunggu dialog menutup agar konfeti tidak tertutup lapisan atas.
          window.setTimeout(() => void celebrate(), 250);
        },
        onError: (error) =>
          showAlert({
            tone: 'error',
            title: 'Pembayaran belum terkonfirmasi',
            message: toUserMessage(error),
            actions: [{ label: 'Mengerti' }],
          }),
      },
    );
  }

  function jalankanBatal() {
    batalkan.mutate(detail.sesi_id, {
      onSuccess: () => {
        void navigate('/admin');
        notify.warning(
          `Sesi meja ${nomor} dibatalkan`,
          'Pesanan tetap tercatat. Meja kosong lagi.',
        );
      },
      onError: (error) =>
        showAlert({
          tone: 'error',
          title: 'Sesi belum bisa dibatalkan',
          message: toUserMessage(error),
          actions: [{ label: 'Mengerti' }],
        }),
    });
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex animate-muncul flex-col gap-6 rounded-ui border border-garis bg-putih p-5 sm:p-6">
        <p className="text-body-s text-ampas">
          Dibuka {formatJam(detail.dibuka_at)}
          {detail.minta_bill_at ? `, bill diminta ${formatJam(detail.minta_bill_at)}` : ''}
        </p>

        {belumDiantar > 0 ? (
          <InlineMessage tone="info">
            Masih ada {belumDiantar} pesanan belum diantar. Konfirmasi bayar tetap bisa dilakukan.
          </InlineMessage>
        ) : null}

        <ol className="flex flex-col divide-y divide-garis border-t border-garis">
          {detail.pesanan.map((p, i) => (
            <li key={p.id} className="py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    Pesanan {i + 1}{' '}
                    <span className="font-normal text-ampas">jam {formatJam(p.created_at)}</span>
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-body-s">
                    <span className="font-medium">{p.pelanggan.nama}</span>
                    <a
                      href={`tel:${p.pelanggan.no_hp}`}
                      className="inline-flex min-h-8 items-center gap-1 rounded-ui text-blirik underline underline-offset-2 tabular-nums"
                    >
                      <Phone size={14} aria-hidden="true" />
                      {p.pelanggan.no_hp}
                    </a>
                  </p>
                </div>
                <StatusPesananBadge status={p.status} />
              </div>
              <ul className="mt-3 flex flex-col gap-1">
                {p.items.map((item) => (
                  <li key={item.nama_menu} className="flex justify-between gap-3">
                    <span>
                      <span className="tabular-nums">{item.qty}</span> × {item.nama_menu}{' '}
                      <span className="text-body-s text-ampas tabular-nums">
                        @ {formatRupiah(item.harga_satuan)}
                      </span>
                    </span>
                    <span className="whitespace-nowrap tabular-nums">
                      {formatRupiah(item.qty * item.harga_satuan)}
                    </span>
                  </li>
                ))}
              </ul>
              {p.catatan ? (
                <p className="mt-2 text-body-s text-ampas">Catatan: {p.catatan}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <aside className="flex animate-muncul flex-col gap-6 rounded-ui border border-garis bg-putih p-5 [animation-delay:80ms] sm:p-6 lg:sticky lg:top-24 lg:self-start">
        <div>
          <p className="text-body-s text-ampas">Total tagihan</p>
          <p className="font-display text-display-l tabular-nums">{formatRupiah(detail.total)}</p>
        </div>

        <p className="text-body-s">
          <span className="text-ampas">Dipilih pelanggan: </span>
          <span className="font-medium">
            {detail.metode_bayar ? LABEL_METODE[detail.metode_bayar] : 'belum memilih'}
          </span>
        </p>

        <Select
          label="Metode bayar"
          value={metode}
          onChange={(e) => setMetodePilihan(e.target.value === 'qris' ? 'qris' : 'kasir')}
          options={[
            { value: 'qris', label: 'QRIS' },
            { value: 'kasir', label: 'Bayar di kasir (tunai)' },
          ]}
        />

        <Button fullWidth onClick={() => setDialog('konfirmasi')}>
          Konfirmasi bayar
        </Button>

        <div className="mt-6 flex flex-col gap-2 border-t border-garis pt-6">
          <p className="text-body-s text-ampas">
            Pelanggan pergi tanpa bayar atau salah input? Sesi bisa dibatalkan, pesanan tetap
            tercatat.
          </p>
          <Button variant="danger" onClick={() => setDialog('batal')} className="self-start">
            Batalkan sesi
          </Button>
        </div>
      </aside>

      <Dialog
        open={dialog === 'konfirmasi'}
        onClose={tutupDialog}
        title="Konfirmasi pembayaran"
        description={
          <>
            Konfirmasi pembayaran meja {nomor} sebesar{' '}
            <span className="font-semibold text-tubruk tabular-nums">
              {formatRupiah(detail.total)}
            </span>{' '}
            lewat {LABEL_METODE[metode]}?
          </>
        }
        footer={
          <>
            <Button variant="secondary" onClick={tutupDialog} disabled={konfirmasi.isPending}>
              Batal
            </Button>
            <Button onClick={jalankanKonfirmasi} loading={konfirmasi.isPending}>
              Konfirmasi bayar
            </Button>
          </>
        }
      ></Dialog>

      <Dialog
        open={dialog === 'batal'}
        onClose={tutupDialog}
        title={`Batalkan sesi meja ${nomor}?`}
        description="Pesanan tetap tercatat, meja dikosongkan tanpa pembayaran."
        footer={
          <>
            <Button variant="secondary" onClick={tutupDialog} disabled={batalkan.isPending}>
              Kembali
            </Button>
            <Button variant="danger" onClick={jalankanBatal} loading={batalkan.isPending}>
              Batalkan sesi
            </Button>
          </>
        }
      ></Dialog>
    </div>
  );
}

export function StatusSesiBadge({ status }: { status: 'aktif' | 'minta_bill' }) {
  return status === 'minta_bill' ? (
    <Badge tone="lampu">Minta bill</Badge>
  ) : (
    <Badge tone="blirik">Terisi</Badge>
  );
}
