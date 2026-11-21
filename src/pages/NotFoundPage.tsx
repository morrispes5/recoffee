import { Link } from 'react-router';
import { KursiPlastik } from '../components/brand/icons';
import { buttonClass } from '../components/ui';

/** `*` Tidak ditemukan. */
export default function NotFoundPage() {
  return (
    <div className="min-h-dvh bg-putih">
      <main className="mx-auto flex w-full max-w-pelanggan flex-col items-start gap-4 px-5 pt-24">
        <KursiPlastik size={48} className="text-ampas" />
        <h1 className="font-display text-display-m">Halaman tidak ditemukan</h1>
        <p className="text-ampas">Alamat ini tidak ada. Kalau mau pesan, scan QR di meja kamu.</p>
        <Link to="/" className={buttonClass('secondary')}>
          Ke beranda
        </Link>
      </main>
    </div>
  );
}
