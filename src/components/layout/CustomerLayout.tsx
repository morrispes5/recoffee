import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';

// Panel data mock hanya di mode dev; tidak ikut build produksi.
const DevToolbar = import.meta.env.DEV ? lazy(() => import('../../mocks/DevToolbar')) : null;

/** Kerangka halaman pelanggan: satu kolom, maks 480 px, padding samping 20 px (PRD 15.4). */
export function CustomerLayout() {
  return (
    <div className="min-h-dvh bg-putih">
      <main className="mx-auto w-full max-w-pelanggan px-5 pt-4 pb-32">
        <Outlet />
      </main>
      {DevToolbar ? (
        <Suspense fallback={null}>
          <DevToolbar />
        </Suspense>
      ) : null}
    </div>
  );
}
