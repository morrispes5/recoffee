import type { ReactNode } from 'react';

/** Area menempel di bawah layar pelanggan (bar keranjang, pesan terkirim). */
export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-garis bg-putih">
      <div className="mx-auto w-full max-w-pelanggan px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}
