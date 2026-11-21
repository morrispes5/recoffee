import { AntrianList } from '../features/admin-antrian/AntrianList';

/** `/admin/antrian` Antrian pesanan (PRD 16.8). */
export default function AdminAntrianPage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-l">Antrian pesanan</h1>
        <p className="mt-2 text-ampas">
          Urut dari yang terlama. Pesanan yang sudah diantar hilang dari daftar.
        </p>
      </div>
      <AntrianList />
    </section>
  );
}
