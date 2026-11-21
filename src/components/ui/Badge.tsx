import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'netral' | 'blirik' | 'lampu' | 'kaleng' | 'garis';

const TONE: Record<BadgeTone, string> = {
  netral: 'bg-tegel text-tubruk',
  blirik: 'bg-blirik text-putih',
  lampu: 'bg-lampu text-tubruk',
  kaleng: 'border border-kaleng text-kaleng',
  garis: 'border border-garis text-ampas',
};

/** Badge status. Selalu berisi teks, warna hanya penguat (NFR-06). */
export function Badge({
  tone = 'netral',
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-body-s font-medium whitespace-nowrap',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
