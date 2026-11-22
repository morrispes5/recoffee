import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Area menempel di bawah layar pelanggan (bar keranjang, pesan terkirim), selebar kolom. */
export function BottomBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div
        className={cn(
          'pointer-events-auto mx-auto w-full max-w-pelanggan border-t border-garis bg-putih px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:border-x',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
