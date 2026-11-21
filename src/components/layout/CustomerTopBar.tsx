import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Logo } from '../brand/Logo';

/** Bar atas halaman pelanggan, menempel saat digulir. Isi kanan diatur halaman. */
export function CustomerTopBar({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 -mx-5 border-b border-garis bg-putih px-5">
      <div className="flex h-14 items-center justify-between gap-3">
        <Link to="/" className="-ml-1 rounded-ui px-1 py-2">
          <Logo size="sm" />
        </Link>
        {children ? (
          <nav aria-label="Navigasi pelanggan" className="-mr-2 flex items-center gap-1">
            {children}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
