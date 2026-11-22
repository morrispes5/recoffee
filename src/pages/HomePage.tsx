import { ArrowRight, CookingPot, Hash, Receipt } from '@phosphor-icons/react';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { IkonKategori } from '../components/brand/icons';
import { Logo } from '../components/brand/Logo';
import { RakWarung } from '../components/brand/RakWarung';
import { Skeleton } from '../components/ui';
import { useMenu } from '../features/menu/hooks';
import { MasukMejaForm } from '../features/meja/MasukMejaForm';
import { formatRupiah } from '../lib/format';
import { bacaMejaTerakhir } from '../lib/mejaTerakhir';
import type { Menu } from '../types/domain';

const LANGKAH: { ikon: ReactNode; judul: string; teks: string }[] = [
  {
    ikon: <Hash size={22} aria-hidden="true" />,
    judul: 'Masukkan nomor meja',
    teks: 'Ketik nomor di atas, atau scan QR yang ada di mejamu.',
  },
  {
    ikon: <CookingPot size={22} aria-hidden="true" />,
    judul: 'Pilih menu, kirim pesanan',
    teks: 'Masuk dengan Google sekali, pesanan tercatat atas namamu.',
  },
  {
    ikon: <Receipt size={22} aria-hidden="true" />,
    judul: 'Minta bill',
    teks: 'Bayar kalau sudah selesai, pakai QRIS atau di kasir.',
  },
];

/** Satu menu tersedia per kategori untuk cuplikan di beranda (urutan kategori dari database). */
function pilihSekilas(menu: Menu[]): Menu[] {
  const terpilih = new Map<string, Menu>();
  for (const m of menu) {
    if (m.tersedia && !terpilih.has(m.kategori)) terpilih.set(m.kategori, m);
  }
  return [...terpilih.values()];
}

/**
 * `/` Landing page pemesanan (revisi atas permintaan pemilik, 22 Nov 2026).
 * Pelanggan tanpa QR mengetik nomor meja di sini; yang scan QR langsung ke `/meja/:nomor`.
 */
export default function HomePage() {
  const [mejaTerakhir] = useState(bacaMejaTerakhir);
  const menuQ = useMenu();
  const sekilas = menuQ.data ? pilihSekilas(menuQ.data) : [];
  const termurah = menuQ.data?.length ? Math.min(...menuQ.data.map((m) => m.harga)) : null;

  return (
    <div className="flex flex-col pt-10">
      <div className="flex items-center justify-between gap-4">
        <Logo size="md" />
        <Link
          to="/admin/masuk"
          className="rounded-ui px-2 py-2 text-body-s text-ampas underline-offset-4 hover:text-tubruk hover:underline"
        >
          Kasir
        </Link>
      </div>

      <h1 className="mt-12 animate-muncul font-display text-display-l text-balance">
        Kopi enak, pesan langsung dari meja.
      </h1>
      <p className="mt-4 max-w-[38ch] animate-muncul text-body-l text-ampas [animation-delay:80ms]">
        Pilih menu dari HP, barista langsung meracik. Bayar kalau sudah selesai.
      </p>

      <section
        aria-labelledby="judul-masuk-meja"
        className="mt-8 animate-muncul rounded-ui border-2 border-tubruk bg-putih p-5 [animation-delay:140ms]"
      >
        <h2 id="judul-masuk-meja" className="font-display text-display-m">
          Duduk di meja berapa?
        </h2>
        <p className="mt-1 text-body-s text-ampas">Nomornya ada di stiker QR di atas meja kamu.</p>
        <div className="mt-4">
          <MasukMejaForm />
        </div>
        {mejaTerakhir ? (
          <Link
            to={`/meja/${mejaTerakhir}`}
            className="group mt-4 flex items-center justify-between gap-3 rounded-ui bg-tegel px-4 py-3 text-body-s font-semibold transition-colors hover:bg-garis"
          >
            Lanjut ke meja {mejaTerakhir}
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        ) : null}
      </section>

      <RakWarung className="mt-12 animate-muncul [animation-delay:200ms]" />

      <section
        aria-labelledby="judul-sekilas"
        className="mt-14 animate-muncul [animation-delay:260ms]"
      >
        <div className="flex items-end justify-between gap-3">
          <h2 id="judul-sekilas" className="font-display text-display-m">
            Sekilas menu
          </h2>
          {termurah !== null ? (
            <p className="pb-1 text-body-s text-ampas">mulai {formatRupiah(termurah)}</p>
          ) : null}
        </div>
        {menuQ.isPending ? (
          <Skeleton lines={4} label="Memuat menu" className="mt-5" />
        ) : (
          <ul className="mt-4 divide-y divide-garis border-y border-garis">
            {sekilas.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tegel text-blirik">
                  <IkonKategori kategori={m.kategori} size={22} />
                </span>
                <span className="flex min-w-0 flex-1 items-baseline gap-2">
                  <span className="font-semibold">{m.nama}</span>
                  <span
                    aria-hidden="true"
                    className="min-w-4 flex-1 translate-y-[-0.3em] border-b border-dotted border-ampas/60"
                  />
                  <span className="font-semibold whitespace-nowrap tabular-nums">
                    {formatRupiah(m.harga)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-body-s text-ampas">
          Menu lengkap muncul setelah kamu masukkan nomor meja.
        </p>
      </section>

      <section
        aria-labelledby="cara-pesan"
        className="mt-14 animate-muncul [animation-delay:320ms]"
      >
        <h2 id="cara-pesan" className="font-display text-display-m">
          Cara pesan
        </h2>
        <ol className="mt-5 flex flex-col divide-y divide-garis border-y border-garis">
          {LANGKAH.map((l, i) => (
            <li key={l.judul} className="flex gap-4 py-5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blirik text-body-s font-semibold text-putih tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center justify-between gap-3 font-semibold">
                  {l.judul}
                  <span className="text-ampas">{l.ikon}</span>
                </p>
                <p className="mt-1 text-body-s text-ampas">{l.teks}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
