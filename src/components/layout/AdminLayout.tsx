import { SignOut } from '@phosphor-icons/react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../features/auth/useAuth';
import { cn } from '../../lib/cn';
import { toUserMessage } from '../../lib/errors';
import { Logo } from '../brand/Logo';
import { InlineMessage } from '../ui';

const NAV = [
  // Detail meja dibuka dari denah, jadi tab Denah tetap aktif di sana.
  {
    to: '/admin',
    label: 'Denah',
    aktif: (p: string) => p === '/admin' || p.startsWith('/admin/meja'),
  },
  { to: '/admin/antrian', label: 'Antrian', aktif: (p: string) => p.startsWith('/admin/antrian') },
  { to: '/admin/menu', label: 'Menu', aktif: (p: string) => p.startsWith('/admin/menu') },
] as const;

/** Kerangka admin dengan navigasi atas (PRD 15.4, 16.6). */
export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [error, setError] = useState<string | null>(null);

  async function keluar() {
    setError(null);
    try {
      await signOut();
      void navigate('/admin/masuk', { replace: true });
    } catch (e) {
      setError(toUserMessage(e));
    }
  }

  return (
    <div className="min-h-dvh bg-putih">
      <header className="border-b border-garis">
        <div className="mx-auto flex w-full max-w-admin flex-wrap items-center gap-x-8 gap-y-1 px-5 py-2 sm:px-8">
          <Link to="/admin" className="rounded-ui py-2">
            <Logo size="sm" />
          </Link>
          <nav
            aria-label="Menu admin"
            className="order-3 -ml-3 flex w-full sm:order-none sm:w-auto"
          >
            {NAV.map((item) => {
              const aktif = item.aktif(pathname.replace(/\/$/, '') || '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={aktif ? 'page' : undefined}
                  className={cn(
                    'relative inline-flex min-h-11 items-center rounded-ui px-3 text-body font-medium hover:bg-tegel',
                    aktif
                      ? 'text-tubruk after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:bg-blirik'
                      : 'text-ampas hover:text-tubruk',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2 text-body-s">
            {user ? (
              <>
                <span className="hidden max-w-[24ch] truncate text-ampas md:inline">
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={() => void keluar()}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-ui px-2 font-medium text-tubruk hover:bg-tegel"
                >
                  <SignOut size={18} aria-hidden="true" />
                  Keluar
                </button>
              </>
            ) : (
              <Link
                to="/admin/masuk"
                className="inline-flex min-h-11 items-center rounded-ui px-2 font-medium text-tubruk hover:bg-tegel"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-admin px-5 py-10 sm:px-8 sm:py-12">
        {error ? (
          <InlineMessage tone="error" className="mb-6">
            {error}
          </InlineMessage>
        ) : null}
        <Outlet />
      </main>
    </div>
  );
}
