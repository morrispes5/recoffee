import { ArrowLeft } from '@phosphor-icons/react';
import { Link, useParams } from 'react-router';
import { DetailMeja, StatusSesiBadge } from '../features/admin-meja/DetailMeja';
import { useDetailMeja } from '../features/admin-meja/hooks';
import { parseNomorMeja } from '../lib/meja';

/** `/admin/meja/:nomor` Detail tagihan meja (PRD 16.7). */
export default function AdminDetailMejaPage() {
  const nomor = parseNomorMeja(useParams().nomor);
  return (
    <section className="flex flex-col gap-6">
      <Link
        to="/admin"
        className="-ml-1 inline-flex min-h-11 items-center gap-2 self-start rounded-ui px-1 text-body-s text-ampas hover:text-tubruk"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Denah meja
      </Link>
      {nomor === null ? (
        <h1 className="font-display text-display-l">Meja tidak ditemukan</h1>
      ) : (
        <>
          <JudulMeja nomor={nomor} />
          <DetailMeja nomor={nomor} />
        </>
      )}
    </section>
  );
}

function JudulMeja({ nomor }: { nomor: number }) {
  const status = useDetailMeja(nomor).data?.status;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <h1 className="font-display text-display-l">Meja {nomor}</h1>
      {status ? <StatusSesiBadge status={status} /> : null}
    </div>
  );
}
