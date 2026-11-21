import { Link } from 'react-router';
import { BijiKopi } from '../components/brand/icons';
import { Logo } from '../components/brand/Logo';

/** `/` Beranda singkat (PRD 16.2). Tanpa hero gambar, rata kiri. */
export default function HomePage() {
  return (
    <div className="flex min-h-[70dvh] flex-col pt-12">
      <Logo size="md" />
      <div className="mt-12 flex max-w-[34ch] flex-col gap-3 text-body-l">
        <p>Scan QR di meja kamu untuk mulai pesan.</p>
        <p className="text-ampas">Bayar kalau sudah selesai, pakai QRIS atau di kasir.</p>
      </div>
      <BijiKopi size={20} className="mt-12 text-blirik" />
      <Link
        to="/admin/masuk"
        className="mt-auto self-start rounded-ui py-3 text-body-s text-ampas underline-offset-4 hover:text-tubruk hover:underline"
      >
        Masuk sebagai kasir
      </Link>
    </div>
  );
}
