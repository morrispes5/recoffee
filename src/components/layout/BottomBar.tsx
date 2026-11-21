import type { ReactNode } from 'react';

/** Area menempel di bawah layar pelanggan (bar keranjang, pesan terkirim), selebar kolom. */
export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div className="pointer-events-auto mx-auto w-full max-w-pelanggan border-t border-garis bg-putih px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:border-x">
        {children}
      </div>
    </div>
  );
}
