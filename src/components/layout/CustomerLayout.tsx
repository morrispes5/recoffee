import { Outlet } from 'react-router';

/** Kerangka halaman pelanggan: satu kolom, maks 480 px, padding samping 20 px (PRD 15.4). */
export function CustomerLayout() {
  return (
    <div className="min-h-dvh bg-putih">
      <main className="mx-auto w-full max-w-pelanggan px-5 pt-6 pb-24">
        <Outlet />
      </main>
    </div>
  );
}
