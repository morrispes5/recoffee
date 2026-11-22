import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router';

/**
 * Transisi antar halaman: isi halaman memudar masuk saat alamat berubah.
 * Hanya opacity (tanpa transform) agar `position: fixed/sticky` di dalamnya tidak bergeser.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <m.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  );
}
