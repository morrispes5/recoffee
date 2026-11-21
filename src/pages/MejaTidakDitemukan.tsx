import { CangkirTubruk } from '../components/brand/icons';

/** FR-01: nomor meja di luar 1–28. */
export function MejaTidakDitemukan() {
  return (
    <section className="flex flex-col items-start gap-4 pt-12">
      <CangkirTubruk size={48} className="text-ampas" />
      <h1 className="font-display text-display-m">Meja tidak ditemukan</h1>
      <p className="text-ampas">Scan ulang QR di meja kamu.</p>
    </section>
  );
}
