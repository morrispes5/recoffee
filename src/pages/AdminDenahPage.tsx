import { Coffee, ListChecks, Money, Receipt } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { InlineMessage, Panel, Skeleton } from '../components/ui';
import { useAntrian } from '../features/admin-antrian/hooks';
import { PerluDitagih } from '../features/admin-dashboard/PerluDitagih';
import { StatCard } from '../features/admin-dashboard/StatCard';
import { Terlaris } from '../features/admin-dashboard/Terlaris';
import { useRingkasanHariIni } from '../features/admin-dashboard/hooks';
import { DenahMeja } from '../features/admin-meja/DenahMeja';
import { useDenah } from '../features/admin-meja/hooks';
import { toUserMessage } from '../lib/errors';
import { pesanDariState } from '../lib/flash';
import { TOTAL_MEJA } from '../lib/meja';
import { formatTanggalPanjang } from '../lib/waktu';

/** Jam berjalan untuk teks "menunggu X menit"; cukup diperbarui tiap 30 detik. */
function useSekarang(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

/**
 * `/admin` Dasbor kasir: ringkasan hari ini, meja yang perlu ditagih, menu terlaris,
 * dan denah meja (PRD 16.6, diperkaya atas permintaan pemilik proyek).
 */
export default function AdminDenahPage() {
  const pesan = pesanDariState(useLocation().state);
  const now = useSekarang();
  const denahQ = useDenah();
  const antrianQ = useAntrian();
  const ringkasanQ = useRingkasanHariIni();

  const meja = denahQ.data ?? [];
  const terisi = meja.filter((m) => m.status !== 'kosong').length;
  const mintaBill = meja.filter((m) => m.status === 'minta_bill').length;
  const berjalan = meja.reduce((sum, m) => sum + m.total, 0);
  const antrian = antrianQ.data ?? [];
  const baru = antrian.filter((r) => r.status === 'baru').length;
  const ringkasan = ringkasanQ.data;

  const siap = denahQ.isSuccess && antrianQ.isSuccess && ringkasanQ.isSuccess;
  const galat = denahQ.error ?? antrianQ.error ?? ringkasanQ.error;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex animate-muncul flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-body-s text-ampas">{formatTanggalPanjang(now)}</p>
          <h1 className="font-display text-display-l">Dasbor kasir</h1>
        </div>
      </header>

      {pesan ? (
        <InlineMessage tone="sukses" className="max-w-xl animate-muncul">
          {pesan}
        </InlineMessage>
      ) : null}
      {galat ? <InlineMessage tone="error">{toUserMessage(galat)}</InlineMessage> : null}

      {siap && ringkasan ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Pendapatan hari ini"
            nilai={ringkasan.pendapatan}
            rupiah
            tone="blirik"
            ikon={<Money size={20} aria-hidden="true" />}
            keterangan={`${ringkasan.transaksi} transaksi: QRIS ${ringkasan.perMetode.qris}, kasir ${ringkasan.perMetode.kasir}`}
          />
          <StatCard
            label="Tagihan berjalan"
            nilai={berjalan}
            rupiah
            ikon={<Coffee size={20} aria-hidden="true" />}
            keterangan={`${terisi} dari ${TOTAL_MEJA} meja terisi`}
            delay={60}
          />
          <StatCard
            label="Pesanan menunggu"
            nilai={antrian.length}
            ikon={<ListChecks size={20} aria-hidden="true" />}
            keterangan={`Baru ${baru}, diproses ${antrian.length - baru}`}
            to="/admin/antrian"
            delay={120}
          />
          <StatCard
            label="Minta bill"
            nilai={mintaBill}
            tone="lampu"
            sorot={mintaBill > 0}
            ikon={<Receipt size={20} aria-hidden="true" />}
            keterangan={mintaBill > 0 ? 'Segera konfirmasi pembayaran' : 'Belum ada yang menunggu'}
            delay={180}
          />
        </div>
      ) : !galat ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-ui border border-garis bg-putih p-5">
              <Skeleton lines={3} label="Memuat ringkasan" />
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel judul="Denah meja" id="judul-denah" delay={120}>
          <DenahMeja />
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel judul="Perlu ditagih" id="judul-perlu-ditagih" delay={180}>
            {denahQ.isSuccess ? (
              <PerluDitagih meja={meja} now={now} />
            ) : (
              <Skeleton lines={2} label="Memuat" />
            )}
          </Panel>
          <Panel judul="Terlaris hari ini" id="judul-terlaris" delay={240}>
            {ringkasan ? (
              <Terlaris data={ringkasan.terlaris} />
            ) : (
              <Skeleton lines={4} label="Memuat" />
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
