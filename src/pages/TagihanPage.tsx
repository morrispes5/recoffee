import { ArrowLeft } from '@phosphor-icons/react';
import { Link, useParams } from 'react-router';
import { CustomerTopBar } from '../components/layout/CustomerTopBar';
import { linkHeaderClass } from '../components/layout/CustomerHeader';
import { RequireLogin } from '../features/auth/RequireLogin';
import { TagihanMeja } from '../features/tagihan/TagihanMeja';
import { parseNomorMeja } from '../lib/meja';
import { MejaTidakDitemukan } from './MejaTidakDitemukan';

/** `/meja/:nomor/tagihan` Tagihan meja + minta bill + QRIS (PRD 16.4). */
export default function TagihanPage() {
  const nomor = parseNomorMeja(useParams().nomor);
  if (nomor === null) return <MejaTidakDitemukan />;

  return (
    <>
      <CustomerTopBar>
        <Link to={`/meja/${nomor}`} className={linkHeaderClass}>
          <ArrowLeft size={18} aria-hidden="true" />
          Kembali ke menu
        </Link>
      </CustomerTopBar>
      <section className="animate-muncul pt-8">
        <h1 className="font-display text-display-l">Tagihan meja {nomor}</h1>
        <div className="mt-2">
          <RequireLogin penjelasan="Masuk dulu untuk melihat tagihan meja ini. Menu tetap bisa dilihat tanpa masuk.">
            <TagihanMeja nomor={nomor} />
          </RequireLogin>
        </div>
      </section>
    </>
  );
}
