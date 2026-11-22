import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Panel putih bergaris untuk halaman admin (latar `tegel`). Muncul halus saat dimuat. */
export function Panel({
  judul,
  aksi,
  children,
  className,
  delay = 0,
  id,
}: {
  judul?: ReactNode;
  aksi?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Jeda animasi muncul dalam ms, untuk efek berurutan. */
  delay?: number;
  id?: string;
}) {
  const style: CSSProperties = { animationDelay: `${delay}ms` };
  return (
    <section
      aria-labelledby={judul && id ? id : undefined}
      style={style}
      className={cn('animate-muncul rounded-ui border border-garis bg-putih p-5 sm:p-6', className)}
    >
      {judul ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id={id} className="font-display text-[1.375rem] leading-tight">
            {judul}
          </h2>
          {aksi}
        </div>
      ) : null}
      {children}
    </section>
  );
}
