import { useParams } from 'react-router';
import { parseNomorMeja } from '../lib/meja';

/** `/admin/meja/:nomor` Detail tagihan meja. Dibangun di M3. */
export default function AdminDetailMejaPage() {
  const nomor = parseNomorMeja(useParams().nomor);
  return (
    <h1 className="font-display text-display-l">
      {nomor === null ? 'Meja tidak ditemukan' : `Meja ${nomor}`}
    </h1>
  );
}
