import { BookOpenText, ListChecks, SignOut, SquaresFour } from '@phosphor-icons/react';
import { useState, type ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useAntrian } from '../../features/admin-antrian/hooks';
import { useAuth } from '../../features/auth/useAuth';
import { cn } from '../../lib/cn';
import { toUserMessage } from '../../lib/errors';
import { Logo } from '../brand/Logo';
import { InlineMessage } from '../ui';

const NAV: { to: string; label: string; ikon: ReactNode; aktif: (p: string) => boolean }[] = [
  // Detail meja dibuka dari denah, jadi tab Dasbor tetap aktif di sana.
  {
    to: '/admin',
    label: 'Dasbor',
    ikon: <SquaresFour size={18} aria-hidden="true" />,
    aktif: (p) => p === '/admin' || p.startsWith('/admin/meja'),
  },
  {
    to: '/admin/antrian',
    label: 'Antrian',
    ikon: <ListChecks size={18} aria-hidden="true" />,
    aktif: (p) => p.startsWith('/admin/antrian'),
  },
  {
    to: '/admin/menu',
    label: 'Menu',
    ikon: <BookOpenText size={18} aria-hidden="true" />,
    aktif: (p) => p.startsWith('/admin/menu'),
  },
];

/** Kerangka admin: header menempel, navigasi berikon, konten di atas latar `tegel`. */
export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [error, setError] = useState<string | null>(null);
  const antrian = useAntrian().data ?? [];
  const pesananBaru = antrian.filter((r) => r.status === 'baru').length;

  async function keluar() {
    setError(null);
    try {
      await signOut();
      void navigate('/admin/masuk', { replace: true });
    } catch (e) {
      setError(toUserMessage(e));
    }
  }

  const path = pathname.replace(/\/$/, '') || '/';

  return (
    <div className="min-h-dvh bg-tegel">
      <header className="sticky top-0 z-20 border-b border-garis bg-putih/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-admin flex-wrap items-center gap-x-6 gap-y-1 px-5 py-2 sm:px-8">
          <Link to="/admin" className="rounded-ui py-2">
            <Logo size="sm" />
          </Link>
          <nav
            aria-label="Menu admin"
            className="order-3 -mx-1 flex w-full gap-1 sm:order-none sm:w-auto"
          >
            {NAV.map((item) => {
              const aktif = item.aktif(path);
              const badge = item.to === '/admin/antrian' && pesananBaru > 0 ? pesananBaru : null;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={aktif ? 'page' : undefined}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 rounded-ui px-3 text-body-s font-semibold transition-colors duration-150',
                    aktif ? 'bg-tubruk text-putih' : 'text-ampas hover:bg-tegel hover:text-tubruk',
                  )}
                >
                  {item.ikon}
                  {item.label}
                  {badge ? (
                    <span
                      key={badge}
                      className={cn(
                        'grid min-w-5 animate-pop place-items-center rounded-full px-1.5 text-[0.75rem] leading-5 tabular-nums',
                        aktif ? 'bg-lampu text-tubruk' : 'bg-blirik text-putih',
                      )}
                    >
                      <span className="sr-only">, </span>
                      {badge}
                      <span className="sr-only"> pesanan baru</span>
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-body-s">
            <span className="hidden items-center gap-2 text-ampas md:inline-flex">
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-blirik/60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-blirik" />
              </span>
              Live
            </span>
            {user ? (
              <>
                <span
                  className="hidden size-9 place-items-center rounded-full bg-blirik font-semibold text-putih uppercase sm:grid"
                  title={user.email}
                  aria-hidden="true"
                >
                  {user.email.charAt(0)}
                </span>
                <span className="hidden max-w-[22ch] truncate text-ampas lg:inline">
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
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-admin px-5 py-8 sm:px-8 sm:py-10">
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
