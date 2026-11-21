import { useParams } from 'react-router';
import { parseNomorMeja } from '../lib/meja';
import { MejaTidakDitemukan } from './MejaTidakDitemukan';

/** `/meja/:nomor` Menu + keranjang. Papan menu dan keranjang dibangun di M2. */
export default function MejaPage() {
  const nomor = parseNomorMeja(useParams().nomor);
  if (nomor === null) return <MejaTidakDitemukan />;

  return (
    <section aria-labelledby="judul-meja">
      <h1 id="judul-meja" className="flex flex-col">
        <span className="text-body-s text-ampas">Meja</span>
        <span className="font-display text-display-xl">{nomor}</span>
      </h1>
      <p className="mt-3 text-ampas">Pesan dari sini, bayar kalau sudah selesai.</p>
    </section>
  );
}
