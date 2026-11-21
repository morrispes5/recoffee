import { Link, Outlet } from 'react-router';
import { Logo } from '../brand/Logo';

/**
 * Kerangka halaman admin: maks 1120 px, rata kiri (PRD 15.4).
 * Navigasi Denah/Antrian/Menu + email + Keluar dibuat di M3.
 */
export function AdminLayout() {
  return (
    <div className="min-h-dvh bg-putih">
      <header className="border-b border-garis">
        <div className="mx-auto flex min-h-16 w-full max-w-admin items-center px-6">
          <Link to="/admin" className="rounded-ui">
            <Logo size="sm" />
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-admin px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}
