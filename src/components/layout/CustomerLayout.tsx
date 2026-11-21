import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import { CustomerFooter } from './CustomerFooter';

// Panel data mock hanya di mode dev; tidak ikut build produksi.
const DevToolbar = import.meta.env.DEV ? lazy(() => import('../../mocks/DevToolbar')) : null;

/**
 * Kerangka halaman pelanggan: satu kolom, maks 480 px, padding samping 20 px (PRD 15.4).
 * Di layar lebar kolom putih berdiri di atas latar `tegel` (lantai warung) dengan border `garis`,
 * supaya halaman tidak terlihat kosong di laptop.
 */
export function CustomerLayout() {
  return (
    <div className="min-h-dvh bg-putih sm:bg-tegel">
      <div className="mx-auto flex min-h-dvh w-full max-w-pelanggan flex-col bg-putih sm:border-x sm:border-garis">
        <main className="flex-1 px-5">
          <Outlet />
        </main>
        <CustomerFooter />
      </div>
      {DevToolbar ? (
        <Suspense fallback={null}>
          <DevToolbar />
        </Suspense>
      ) : null}
    </div>
  );
}
