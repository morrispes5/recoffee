import { ArrowLeft } from '@phosphor-icons/react';
import { Link, useParams } from 'react-router';
import { RequireLogin } from '../features/auth/RequireLogin';
import { TagihanMeja } from '../features/tagihan/TagihanMeja';
import { parseNomorMeja } from '../lib/meja';
import { MejaTidakDitemukan } from './MejaTidakDitemukan';

/** `/meja/:nomor/tagihan` Tagihan meja + minta bill + QRIS (PRD 16.4). */
export default function TagihanPage() {
  const nomor = parseNomorMeja(useParams().nomor);
  if (nomor === null) return <MejaTidakDitemukan />;

  return (
    <section>
      <Link
        to={`/meja/${nomor}`}
        className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-ui px-1 text-body-s text-ampas hover:text-tubruk"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Kembali ke menu
      </Link>
      <h1 className="mt-6 font-display text-display-m">Tagihan meja {nomor}</h1>
      <div className="mt-2">
        <RequireLogin penjelasan="Masuk dulu untuk melihat tagihan meja ini. Menu tetap bisa dilihat tanpa masuk.">
          <TagihanMeja nomor={nomor} />
        </RequireLogin>
      </div>
    </section>
  );
}
