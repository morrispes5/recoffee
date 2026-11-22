import { CookingPot, QrCode, Receipt } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Logo } from '../components/brand/Logo';
import { RakWarung } from '../components/brand/RakWarung';

const LANGKAH: { ikon: ReactNode; judul: string; teks: string }[] = [
  {
    ikon: <QrCode size={22} aria-hidden="true" />,
    judul: 'Scan QR di meja',
    teks: 'Nomor meja langsung terisi. Menu bisa dilihat tanpa masuk.',
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

/** `/` Beranda (PRD 16.2). Tanpa hero gambar; visual hanya dari ikon garis dan tipografi. */
export default function HomePage() {
  return (
    <div className="flex flex-col pt-10">
      <Logo size="md" />

      <h1 className="mt-14 animate-muncul font-display text-display-l text-balance">
        Pesan dari meja, bayar kalau sudah selesai.
      </h1>
      <p className="mt-4 max-w-[36ch] animate-muncul text-body-l text-ampas [animation-delay:80ms]">
        Scan QR di meja kamu untuk mulai pesan.
      </p>

      <RakWarung className="mt-12 animate-muncul [animation-delay:160ms]" />

      <section
        aria-labelledby="cara-pesan"
        className="mt-16 animate-muncul [animation-delay:240ms]"
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

      <div className="mt-10">
        <Link
          to="/admin/masuk"
          className="rounded-ui py-3 text-body-s text-ampas underline-offset-4 hover:text-tubruk hover:underline"
        >
          Masuk sebagai kasir
        </Link>
      </div>
    </div>
  );
}
